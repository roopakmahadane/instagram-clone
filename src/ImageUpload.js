import React,{ useState} from 'react'
import { Button } from '@material-ui/core'
import { storage, db} from './firebase'
import firebase from 'firebase';
import './imageUpload.css'


function ImageUpload({username}) {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0) 

    const handleChange = (e) => {
        if(e.target.files[0]){
           setImage(e.target.files[0])
        }
    }
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on('state_changed', function(snapshot){
            var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(progress)
          }, function(error) {
            console.log(error)
          }, function() {
            storage
              .ref("images")
              .child(image.name)
              .getDownloadURL()
              .then(url => {
                  db.collection("posts").add({
                      timestamp : firebase.firestore.FieldValue.serverTimestamp(),
                      caption:caption,
                      imageUrl:url,
                      userName: username
                  });
                  setProgress(0)
                  setCaption("");
                  setImage(null);
              })
          });
    }
    return (
  
        <div className="imageUpload">
           {/* we need */}
           {/* caption input */}
           {/* filepicker */}
           {/* post button */}
           <center>
          <img 
              className="app__headerImage" 
              src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
             </center>
           <progress className="imageUpload__progress" value={progress} max="100"/>
           <input className="imageUpload__caption" type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="caption"/>
           <input type="file" onChange={handleChange} accept="image/x-png,image/gif,image/jpeg"/>
           <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload


