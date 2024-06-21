import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { HttpException, Injectable } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { of, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { CustomError } from '@coti-cvi/lw-sdk'

@Injectable()
export class AdminApiInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error: Error | CustomError) => {
        if (error instanceof CustomError) {
          const httpException = error.getHttpException()
          return of(new HttpException(httpException, httpException.httpStatusCode))
        }

        return throwError(error)
      }),
    )
  }
}
