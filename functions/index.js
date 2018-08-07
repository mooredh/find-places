const functions = require('firebase-functions');
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })
const fs = require('fs')
const UUID = require("uuid-v4")
const gcconfig = {
    projectId: 'find-places-79edd',
    keyFileName: 'find-places.json'
}
const gcs = require('@google-cloud/storage')(gcconfig)

admin.initializeApp({
    credential: admin.credential.cert(require('./find-places.json'))
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.storeImage = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        if (!request.headers.authorization || !request.headers.authorization.startsWith("Bearer ")) {
            response.status(403).json({ error: "Unauthorized user" });
            return
        }
        let idToken = request.headers.authorization.split("Bearer ")[1]

        admin.auth().verifyIdToken(idToken)
            .then(decodedToken => {
                const body = JSON.parse(request.body)
                fs.writeFileSync('/tmp/uploaded-image.jpg', body.image, "base64", error => {
                    return response.status(500).json({
                        error
                    })
                })
                const bucket = gcs.bucket('find-places-79edd.appspot.com')
                const uuid = UUID()
                bucket.upload('/tmp/uploaded-image.jpg', {
                    uploadType: 'media',
                    destination: '/places/' + uuid + '.jpg',
                    metadata: {
                        metadata: {
                            contentType: 'Image/jpeg',
                            firebaseStorageDownloadTokens: uuid
                        }
                    }
                }, (error, file) => {
                    if (!error) {
                        response.status(201).json({
                            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/' +
                                bucket.name +
                                '/o/' +
                                encodeURIComponent(file.name) +
                                "?alt=media&token=" +
                                uuid,
                            imagePath: "/places/" + uuid + ".jpg"
                        })
                    } else {
                        response.status(500).json({
                            error
                        })

                    }
                })
            })
            .catch(e => {
                response.status(403).json({ error: 'Unauthorized user' })
            })



    })
});

exports.deleteImage = functions.database.ref("/places/{placeId}").onDelete((snapshot, context) => {
    const placeData = snapshot.val()
    const imagePath = placeData.imagePath

    const bucket = gcs.bucket('find-places-79edd.appspot.com')
    return bucket.file(imagePath).delete();
})