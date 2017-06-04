import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as algoliasearch from 'algoliasearch'

const config = functions.config()

admin.initializeApp(config.firebase)

const client = algoliasearch(config.algolia.app_id, config.algolia.api_key)

const ALGOLIA_POSTS_INDEX_NAME = 'notes'


export const indexNote = functions.database.ref('notes/{uid}/{noteId}').onWrite(event => {
  const index = client.initIndex(ALGOLIA_POSTS_INDEX_NAME)
  const firebaseObject = {
    title: event.data.val().title,
    content: event.data.val().content,
    author: event.data.val().author,
    uid: event.params.uid,
    noteId: event.params.noteId,
    objectID: event.params.uid + '/' + event.params.noteId,
  }
  return index.addObject(firebaseObject)
})

export const searchNote = functions.database.ref('search/{uid}/query').onWrite(event => {
  const uid = event.params.uid
  const index = client.initIndex(ALGOLIA_POSTS_INDEX_NAME);
  const params: algoliasearch.AlgoliaQueryParameters = {
    query: event.data.val().keyword,
    filters: `uid:${uid}`,
    attributesToRetrieve: ['noteId', 'title', 'author', 'content'],
    attributesToHighlight: ['title', 'author', 'content'],
    // restrictSearchableAttributes: ['uid'],
  }
  // const key = event.data.key;

  return index.search(params).then(content => {
    const noteIds = content.hits.map(hit => hit.noteId) || []
    content.noteIds = noteIds
    return admin.database().ref('search/' + uid + '/results').set(content);
  });
})
