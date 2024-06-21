/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PipeTransform, Type } from '@nestjs/common'
import fs from 'fs'
// @ts-ignore
import pkgUp from 'pkg-up'
import { CustomError, ErrorKind } from '@coti-cvi/lw-sdk'
import { StatusCodes } from 'http-status-codes'
import isEthereumAddress from 'is-ethereum-address'
import { createTransport } from '@sentry/core'
import type { NodeClientOptions } from '@sentry/node/types/types'
import { resolvedSyncPromise } from '@sentry/utils'
import { defaultStackParser } from '@sentry/node'
import path from 'path'

export function sliceGeneratedIdFromPodName(replicaId: string): { runtimeName: string; isDeployment: boolean } {
  let runtimeName
  const split = replicaId.split('-')
  const isStatefulSet = split.length >= 2 && split[split.length - 1].length === 1
  const isDeployment = split.length >= 3 && split[split.length - 2].length > 1 && split[split.length - 1].length > 1
  if (isStatefulSet) {
    runtimeName = split.slice(0, split.length - 1).join('-')
  } else {
    if (isDeployment) {
      runtimeName = split.slice(0, split.length - 2).join('-')
    } else {
      throw new Error(
        `unsupported runtime. can't identify if it's a statefulset or a deployment. are you running AppEnv.K8s locally?`,
      )
    }
  }

  return {
    runtimeName,
    isDeployment,
  }
}

export function packagePath(pathInsidePackage: string): string {
  const packageJsonPath = pkgUp.sync({
    cwd: pathInsidePackage,
  })
  if (!packageJsonPath) {
    throw new Error("can't find package.json of this service.")
  }
  return path.dirname(packageJsonPath)
}

export function getPackageJson(pathInsidePackage: string): { name: string; version: string } {
  return JSON.parse(fs.readFileSync(path.join(packagePath(pathInsidePackage), 'package.json'), 'utf-8'))
}

// https://stackoverflow.com/a/56044932/806963
export const getEnumKeys = <T extends Record<string, string | number>>(enumObject: T): (keyof T)[] =>
  Object.keys(enumObject).filter(x => Number.isNaN(Number(x)))

export const getEnumValues = <T extends Record<string, string | number>>(enumObject: T): T[keyof T][] => {
  const keys = getEnumKeys(enumObject)
  return keys.map(key => enumObject[key])
}

export function verifyEnumQueryParamPipe<Enum extends Record<string | number, any>, QueryParamKey extends string>(
  enum1: Enum,
  queryParamKey: QueryParamKey,
): Type<PipeTransform> | PipeTransform {
  return {
    transform: (query: Record<QueryParamKey, Enum>) => {
      const r = Object.values(enum1).find(e => e === query[queryParamKey])
      if (!r) {
        throw new CustomError({
          name: 'InvalidParameter',
          message: `Invalid value for enum: ${query[queryParamKey]}. Valid values are: ${Object.values(enum1).join(
            ', ',
          )}`,
          errorKind: ErrorKind.UserError,
          httpStatus: StatusCodes.BAD_REQUEST,
          extras: {
            allQueryParams: query,
            badQueryParam: {
              key: queryParamKey,
              actualInvalidValue: query[queryParamKey] ?? query[queryParamKey] === undefined ? 'not specified' : null,
              expectedValidValues: Object.values(enum1).join(', '),
            },
          },
        })
      }
      return query
    },
  }
}

export function transformParamToArray(): Type<PipeTransform> | PipeTransform {
  return {
    transform: (queryParamValue: unknown) => {
      if (typeof queryParamValue !== 'string') {
        throw new CustomError({
          name: 'InvalidParameter',
          message: `expected a string representation of an array (e.g. '1,2,3')`,
          errorKind: ErrorKind.UserError,
          httpStatus: StatusCodes.BAD_REQUEST,
          extras: {
            queryParamValue,
          },
        })
      }

      return queryParamValue.split(',')
    },
  }
}

export function disallowStringArrayWithDuplicatesPipe(): Type<PipeTransform> | PipeTransform {
  return {
    transform: (queryParamValue: unknown[]) => {
      if (!queryParamValue) {
        return []
      }

      if (!Array.isArray(queryParamValue)) {
        throw new CustomError({
          name: 'InvalidParameter',
          message: `expected an array of strings`,
          errorKind: ErrorKind.UserError,
          httpStatus: StatusCodes.BAD_REQUEST,
          extras: {
            queryParamValue,
          },
        })
      }

      if (queryParamValue.length !== new Set(queryParamValue).size) {
        throw new CustomError({
          name: 'InvalidDuplicateValuesParameter',
          message: `expected an array of primitives without duplicates`,
          errorKind: ErrorKind.UserError,
          httpStatus: StatusCodes.BAD_REQUEST,
          extras: {
            queryParamValue,
          },
        })
      }

      return queryParamValue
    },
  }
}

export function verifyOneOfPipe(
  validValues: string[],
  options?: { required?: boolean },
): Type<PipeTransform> | PipeTransform {
  return {
    transform: (queryParamValue: string) => {
      if (!options?.required && !queryParamValue) {
        return queryParamValue
      }
      if (!validValues.map(r => r.toString()).includes(queryParamValue)) {
        throw new CustomError({
          name: 'InvalidOneOfParameter',
          message: `expected one of the valid values`,
          errorKind: ErrorKind.UserError,
          httpStatus: StatusCodes.BAD_REQUEST,
          extras: {
            queryParamValue,
            validValues,
          },
        })
      }

      return queryParamValue
    },
  }
}

export function verifyValidEthersWalletsIdsPipe(): Type<PipeTransform> | PipeTransform {
  return {
    transform: (queryParamValue: unknown[]) => {
      if (!queryParamValue) {
        return []
      }

      if (!Array.isArray(queryParamValue)) {
        throw new CustomError({
          name: 'InvalidParameter',
          message: `expected an array of strings`,
          errorKind: ErrorKind.UserError,
          httpStatus: StatusCodes.BAD_REQUEST,
          extras: {
            queryParamValue,
          },
        })
      }

      const invalidWalletsIds = queryParamValue.filter(walletId => !isEthereumAddress(walletId))

      if (invalidWalletsIds.length > 0) {
        throw new CustomError({
          name: 'InvalidDuplicateValuesParameter',
          message: `expected an array of valid ether wallet ids`,
          errorKind: ErrorKind.UserError,
          httpStatus: StatusCodes.BAD_REQUEST,
          extras: {
            queryParamValue,
            invalidWalletsIds,
          },
        })
      }

      return queryParamValue
    },
  }
}

export function getDefaultNodeClientOptions(options: Partial<NodeClientOptions> = {}): NodeClientOptions {
  return {
    integrations: [],
    transport: () => createTransport({ recordDroppedEvent: () => undefined }, _ => resolvedSyncPromise({})),
    stackParser: defaultStackParser,
    ...options,
  }
}
