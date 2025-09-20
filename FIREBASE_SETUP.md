# Firebase Setup Guide for File Upload

## 1. Firebase Console Setup

### Enable Firebase Storage
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `explore-my-kerala`
3. Go to **Storage** in the left sidebar
4. Click **Get Started**
5. Choose **Start in test mode** (for development)
6. Select a location for your storage bucket (choose closest to your users)

### Configure Storage Rules
1. In Firebase Console, go to **Storage** → **Rules**
2. Replace the default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload images
    match /packages/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    
    // Allow public read access to uploaded images
    match /packages/{allPaths=**} {
      allow read: if true;
    }
  }
}
```

### For Production (Recommended)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /packages/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.resource.size < 5 * 1024 * 1024  // 5MB limit
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 2. Environment Variables

### Create `.env.local` file
```bash
cp config.env .env.local
```

### Update with your actual Firebase config
1. Go to Firebase Console → Project Settings → General
2. Scroll down to "Your apps" section
3. Click on your web app or create one
4. Copy the config values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 3. Test File Upload

### Check Browser Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Try uploading a file
4. Look for any error messages

### Common Issues & Solutions

#### Issue: "Permission denied" error
**Solution**: Check Firebase Storage rules (step 1 above)

#### Issue: "Storage bucket not found"
**Solution**: 
1. Verify `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` in `.env.local`
2. Make sure Storage is enabled in Firebase Console

#### Issue: "Invalid API key"
**Solution**: 
1. Check all environment variables in `.env.local`
2. Restart your development server after changing env vars

#### Issue: "File too large"
**Solution**: 
- Current limit is 5MB
- Modify the validation in the code if needed

## 4. Verify Setup

### Test Steps
1. Start your development server: `npm run dev`
2. Go to `/admin/login` and login
3. Go to `/admin/packages/[some-id]/edit`
4. Try uploading an image file
5. Check if the image preview appears
6. Save the form and verify the image URL is saved

### Debug Commands
```bash
# Check if env vars are loaded
npm run dev
# Look for any Firebase initialization errors in console

# Check Firebase project
# Go to Firebase Console → Storage → Files
# You should see uploaded files in packages/covers/ folder
```

## 5. Production Considerations

### Security
- Use proper Firebase Storage rules
- Implement file type validation
- Set appropriate file size limits
- Consider using Firebase Auth for user management

### Performance
- Images are automatically optimized by Firebase
- Consider adding image compression before upload
- Use appropriate image formats (WebP, JPEG)

### Monitoring
- Monitor storage usage in Firebase Console
- Set up alerts for unusual activity
- Track upload success/failure rates
