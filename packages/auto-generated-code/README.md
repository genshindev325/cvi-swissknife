### Auto-Generated-Code

package is used to automatically generate code for usage in other packages of this repo, for example, generating API Wrappers for existing packages like py-parabola-coefficients, il-backend, etc for usage within other packages in this monoerpo.

#### Example usage, How to update the wrapper around py-parabola-coefficients

il-monitor and also il-formulas-ui packages, for example, use py-parabola-coefficients package API to query the current
parabola coefficients for the various pairs. If, for example, we had added a new method to py-parabola-coefficients service
one needs to update the open api JSON file so that this package will generate wrapper function with types for the new method.

To do this one needs to follow the following steps:

1) Run py-parabola-coefficients service 
2) Head to http://127.0.0.1:8003/openapi.json of the service and copy and paste its content into:


    packages/auto-generated-code/src/backend-swaggers/py-parabola-coefficients-swagger.json

    NOTE: the name of the file is the following: 

    <package-name>-swagger.json

    Now you can generate the automated code:

    yarn create-auto-generated-code:watch

    and have wrappers around the API with typings etc. 