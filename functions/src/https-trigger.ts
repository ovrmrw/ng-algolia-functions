import { functions, admin, algoliaClient } from './admin';
import { AlgoliaQueryParameters } from 'algoliasearch';
import * as express from 'express'
import { Request } from 'express'
import * as cors from 'cors'

const ALGOLIA_NOTES_INDEX_NAME = 'notes'


const validateFirebaseIdToken = (req: RequestPlus, res, next) => {
  let idToken: string;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    res.status(403).send('Unauthorized');
    return;
  }

  admin.auth().verifyIdToken(idToken)
    .then(decodedIdToken => {
      req.user = decodedIdToken;
      next();
    })
    .catch(error => {
      res.status(403).send('Unauthorized');
    });
};


const app = express()

app.use(cors({ origin: true }))
app.use(validateFirebaseIdToken)

app.get('/hello', (req: RequestPlus, res) => {
  res.send(`Hello ${req.user.name}`);
});

app.post('/search', (req: RequestPlus, res) => {
  const index = algoliaClient.initIndex(ALGOLIA_NOTES_INDEX_NAME);
  const params: AlgoliaQueryParameters = {
    query: req.body.keyword,
    filters: `uid:${req.user.uid}`,
    attributesToRetrieve: ['noteId', 'title', 'author', 'content'],
    attributesToHighlight: ['title', 'author', 'content'],
    // restrictSearchableAttributes: ['uid'],
  }
  // const key = event.data.key;

  return index.search(params)
    .then(content => {
      const noteIds = content.hits.map(hit => hit.noteId) || []
      content.noteIds = noteIds
      res.status(200).send(content)
    })
    .catch(err => {
      res.status(400).send(err)
    });
})

export const api = functions.https.onRequest(app);


interface RequestPlus extends Request {
  user: admin.auth.DecodedIdToken,
}
