import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as algoliasearch from 'algoliasearch'

const config = functions.config()

admin.initializeApp(config.firebase)

const algoliaClient = algoliasearch(config.algolia.app_id, config.algolia.api_key)

export { functions, admin, algoliaClient }
