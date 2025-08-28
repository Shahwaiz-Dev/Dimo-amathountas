import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

// Upload a file and get its download URL with retry logic
export async function uploadFile(file: File, path: string): Promise<string> {
  let attempt = 1;
  const maxRetries = 3;

  while (attempt <= maxRetries) {
    try {
      const storageRef = ref(storage, path);
      
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            // Upload progress monitoring (silent)
          },
          (error) => {
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      const waitTime = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      attempt++;
    }
  }
  
  throw new Error('Upload failed after maximum retries');
} 