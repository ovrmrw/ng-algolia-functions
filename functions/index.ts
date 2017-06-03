import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as algoliasearch from 'algoliasearch'

const config = functions.config()

admin.initializeApp(config.firebase)

const client = algoliasearch(config.algolia.app_id, config.algolia.api_key)

const ALGOLIA_POSTS_INDEX_NAME = 'blogposts'

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!')
})

export const indexentry = functions.database.ref('/blog-posts/{blog-id}/text').onWrite(event => {
  const index = client.initIndex(ALGOLIA_POSTS_INDEX_NAME)
  const firebaseObject = {
    text: event.data.val(),
    objectID: event.params.blogid
  }


})

// {"message":"foobar"}をPOSTしたらAlgoliaに"foobar"がインデクシングされる。
export const postMessage = functions.https.onRequest((req, res) => {
  console.log('body', req.body)
  const index = client.initIndex(ALGOLIA_POSTS_INDEX_NAME)
  const object = {
    text: req.body.message
  }
  index.addObject(object)
    .then(result => res.status(200).send(result))
    .catch(err => res.status(400).send(err))
})
