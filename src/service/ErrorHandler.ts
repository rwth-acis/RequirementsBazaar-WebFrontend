import { store } from './../store';
import { MutationType } from './../store/mutations';
import { UnhandledError } from './../store/state';

/**
 * Can be used either directly from code or in global error hadling functions (see main.ts for our global Promise error handler).
 *
 * If you know the type of error (HTTP error, or more specific Bazaar API error) call the more specialized function. Otherwise,
 * use 'onError(error)' which tries to detect the error type and take appropriate actions.
 *
 * This handler tries to get the bes error information (maybe even a localized message from an API) out of the error and
 * stores it in the global application state. The 'GlobalErrorMessage' will then displays a nice error message to the user.
 */
export default class ErrorHandler {

    static onError(error): boolean {
        console.log('[DEBUG] Handling error...');
        if (error.status && error.error && error.headers) {
            // chances are high we ahve an uncought fetch error response object
            const handled = this.onHttpError(error);
            if (handled) {
                this._markHandled(error);
            }
            return handled;
        }

        console.log('[DEBUG] Undetected error type. Logging as error again...')
        console.error(error);
        // show a message to user anyway
        this._storeError({
            message: 'Unknown error: ' + error.toString(),
            source: 'Frontend',
            details: error.toString(),
            timestamp: Date.now(),
        });

        // return false so caller can properly handle if necesarry
        return false;
    }

    static onHttpError(response) {
        console.log('[DEBUG] Handling HTTP error');
        // response.error might have common properties from Requirements Bazaar API
        const errorData = response.error;
        if (errorData.errorCode && errorData.message && errorData.localizedMessage) {
            // error response is likely in the common API format
            this.onBazaarApiError(response);
        } else {
            // common HTTP error
            this._storeError({
                message: `Unexpected HTTP error (status code: ${response.status}`,
                source: 'HTTP Request',
                details: `HTTP status: ${response.status}; data:` + response.error.toString(),
                timestamp: Date.now(),
            });
        }
        return true;
    }

    static onBazaarApiError(response) {
        console.log('[DEBUG] Handling Bazaar API error');

        this._storeError({
            message: response.error.localizedMessage,
            source: 'Requirements Bazaar API',
            details: `HTTP status: ${response.status}; data:` + response.error.toString(),
            timestamp: Date.now(),
        });
    }

    static _storeError(error: UnhandledError) {
        store.commit(MutationType._AddUnhandledError, error);
    }

    static _markHandled(error) {
        error.ignoreUnhandledRejection = true;
    }
}
