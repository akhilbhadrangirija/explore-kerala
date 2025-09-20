# Cloudinary Setup Guide for Image Upload

## 1. Create Cloudinary Account

1. Go to [Cloudinary.com](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email address

## 2. Get Your Cloudinary Credentials

1. After logging in, go to your [Dashboard](https://cloudinary.com/console)
2. Copy your **Cloud Name** from the dashboard (e.g., `your-cloud-name`)

## 3. Create Upload Preset

1. Go to [Cloudinary Console](https://cloudinary.com/console) → Settings → Upload
2. Click **Add upload preset**
3. Configure the preset:
   - **Preset name**: `explore-my-kerala`
   - **Signing Mode**: **Unsigned** (this allows client-side uploads)
   - **Folder**: `explore-my-kerala`
   - **Transformations**: 
     - Width: 1200, Height: 800, Crop: Fill
     - Quality: Auto
     - Format: Auto
     - **Important**: Add these transformations in the "Incoming Transformations" section
4. Click **Save**

**Note**: Transformations must be configured in the upload preset, not in the upload request. This is a security feature of unsigned uploads.

## 4. Update Environment Variables

### Create `.env.local` file
```bash
cp config.env .env.local
```

### Add your Cloudinary credentials to `.env.local`:
```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=explore-my-kerala
```

**Important Notes:**
- Only `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is needed for client-side uploads
- No API secret is required for unsigned uploads
- The upload preset handles security and transformations

## 5. Configure Next.js for Cloudinary Images

The `next.config.mjs` file has been updated to allow images from Cloudinary:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
      port: '',
      pathname: '/**',
    },
  ],
}
```

**Note**: After updating the config, restart your development server:
```bash
npm run dev
```

## 4. Configure Cloudinary Settings

### Upload Presets (Optional but Recommended)
1. Go to [Cloudinary Console](https://cloudinary.com/console) → Settings → Upload
2. Create a new upload preset:
   - **Preset Name**: `explore-my-kerala`
   - **Signing Mode**: Unsigned
   - **Folder**: `explore-my-kerala`
   - **Transformations**: 
     - Width: 1200, Height: 800, Crop: Fill
     - Quality: Auto
     - Format: Auto

### Security Settings
1. Go to Settings → Security
2. Configure allowed file types: `jpg, jpeg, png, gif, webp`
3. Set max file size: `10MB` (or your preference)
4. Enable secure delivery (HTTPS)

## 5. Test the Setup

### Start your development server:
```bash
npm run dev
```

### Test Steps:
1. Go to `/admin/login` and login
2. Go to `/admin/packages/[some-id]/edit`
3. Try uploading an image file
4. Check if the image appears in your Cloudinary dashboard
5. Verify the image URL is saved to your database

## 6. Benefits of Cloudinary vs Firebase Storage

### Cloudinary Advantages:
- ✅ **Automatic Image Optimization** - WebP, AVIF, responsive images
- ✅ **Built-in Transformations** - Resize, crop, filters, effects
- ✅ **CDN Delivery** - Fast global image delivery
- ✅ **Easy Setup** - No complex rules or configurations
- ✅ **Free Tier** - 25GB storage, 25GB bandwidth/month
- ✅ **Image Analysis** - AI-powered tags, colors, faces
- ✅ **Video Support** - Upload and transform videos too

### Firebase Storage Advantages:
- ✅ **Integrated with Firebase** - If you're already using Firebase
- ✅ **Real-time Updates** - If you need real-time file monitoring
- ✅ **Custom Rules** - More granular access control

## 7. Troubleshooting

### Common Issues:

#### Issue: "Invalid cloud name" error
**Solution**: Check `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` in `.env.local`

#### Issue: "Upload preset not found" error
**Solution**: 
1. Check `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` in `.env.local`
2. Make sure the upload preset exists in Cloudinary console
3. Ensure the preset is set to "Unsigned" mode

#### Issue: "Upload failed" error
**Solution**: 
1. Check your upload preset configuration
2. Restart your development server
3. Check Cloudinary console for any restrictions
4. Verify the preset allows unsigned uploads

#### Issue: "Transformation parameter is not allowed" error
**Solution**: 
1. Remove any transformation parameters from your upload request
2. Configure transformations in the upload preset instead
3. Go to Cloudinary Console → Settings → Upload → Your Preset
4. Add transformations in the "Incoming Transformations" section

#### Issue: Images not appearing
**Solution**:
1. Check browser console for errors
2. Verify the image URL in your database
3. Check Cloudinary dashboard for uploaded files

### Debug Commands:
```bash
# Check if env vars are loaded
npm run dev
# Look for any Cloudinary initialization errors in console

# Check Cloudinary dashboard
# Go to Cloudinary Console → Media Library
# You should see uploaded files in explore-my-kerala folder
```

## 8. Production Considerations

### Security:
- Never expose `CLOUDINARY_API_SECRET` in client-side code
- Use upload presets for unsigned uploads
- Set up proper CORS policies

### Performance:
- Images are automatically optimized by Cloudinary
- Use responsive images with `w_auto` transformation
- Consider using `f_auto` for format optimization

### Monitoring:
- Monitor usage in Cloudinary dashboard
- Set up alerts for bandwidth/storage limits
- Track upload success/failure rates

## 9. Advanced Features (Optional)

### Image Transformations:
```javascript
// In your upload function, you can add transformations:
const result = await cloudinary.uploader.upload(base64, {
  folder: 'explore-my-kerala',
  transformation: [
    { width: 1200, height: 800, crop: 'fill', quality: 'auto' },
    { fetch_format: 'auto' },
    { flags: 'progressive' } // Progressive JPEG
  ]
});
```

### Responsive Images:
```javascript
// Generate different sizes for responsive images
const sizes = [400, 800, 1200, 1600];
const responsiveUrls = sizes.map(size => 
  cloudinary.url(result.public_id, {
    width: size,
    height: Math.round(size * 0.75),
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  })
);
```

### Image Analysis:
```javascript
// Get image analysis data
const analysis = await cloudinary.api.resource(result.public_id, {
  image_metadata: true,
  colors: true,
  faces: true
});
```
