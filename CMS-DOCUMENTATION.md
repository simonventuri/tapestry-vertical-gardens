# Content Management System (CMS) Documentation

## Overview

The Tapestry Vertical Gardens website now includes a comprehensive Content Management System (CMS) that allows you to edit all content and images on the home page through an intuitive admin interface.

## Features

### 🏠 Home Page Content Management
- **Hero Section**: Edit title, subtitle, description, CTA button, and hero image
- **Why Vertical Gardens**: Manage section title, subtitle, and benefits (add/remove/edit)
- **Tapestry Difference**: Control section content and features (add/remove/edit)
- **Living Sculpture**: Edit section title, description, and image
- **FAQs**: Manage frequently asked questions (add/remove/edit)

### 🖼️ Image Management
- Upload new images directly through the CMS interface
- Images are automatically stored in `/public/images/`
- Supports common image formats (JPEG, PNG, WebP, etc.)
- File size limit: 5MB per image

### 💾 Data Storage
- Content is stored in Redis for fast retrieval
- Default content is loaded if no custom content exists
- Easy reset to default content functionality

## How to Access the CMS

1. **Navigate to Admin Dashboard**
   - Go to `/admin` in your browser
   - Login with your admin credentials

2. **Access Content Management**
   - Click on the "Content Management" card in the admin dashboard
   - Or navigate directly to `/admin/content`

## Using the CMS Interface

### Navigation
- **Section Navigation**: Use the left sidebar to switch between different page sections
- **Save Changes**: Use the "Save Changes" button to store your edits
- **Reset to Default**: Use the "Reset to Default" button to restore original content

### Editing Content

#### Hero Section
- **Title**: Main headline of the page
- **Subtitle**: Secondary headline
- **Description**: Lead paragraph text
- **CTA Button**: Call-to-action button text and link
- **Hero Image**: Main banner image and alt text

#### Why Vertical Gardens Section
- **Section Title**: Main section heading
- **Section Subtitle**: Introductory paragraph
- **Benefits**: Add/remove/edit benefit cards
  - Each benefit has a title and description
  - Use "Add Benefit" to create new ones
  - Use "Remove" to delete existing ones

#### Tapestry Difference Section
- **Section Title**: Main section heading
- **Section Subtitle**: Introductory paragraph  
- **Features**: Add/remove/edit feature cards
  - Each feature has a title (HTML allowed) and description
  - Use "Add Feature" to create new ones
  - Use "Remove" to delete existing ones

#### Living Sculpture Section
- **Section Title**: Section heading
- **Description**: Section content
- **Image**: Section image and alt text

#### FAQs Section
- **Questions and Answers**: Add/remove/edit FAQ pairs
  - Use "Add FAQ" to create new questions
  - Use "Remove" to delete existing FAQs

### Image Upload
1. Click the "Upload" button next to any image field
2. Select an image file from your computer
3. The image will be uploaded and the path automatically filled in
4. Remember to save your changes

## API Endpoints

### Public Endpoints
- `GET /api/content` - Retrieve current home page content

### Admin Endpoints (Authentication Required)
- `GET /api/admin/content` - Retrieve content for editing
- `POST /api/admin/content` - Save content changes
- `DELETE /api/admin/content` - Reset to default content
- `POST /api/admin/upload-image` - Upload image files

## Content Structure

The content is organized into the following sections:

```javascript
{
  hero: {
    title: "Page title",
    subtitle: "Page subtitle", 
    description: "Lead paragraph",
    ctaText: "Button text",
    ctaLink: "Button URL",
    image: "Image path",
    imageAlt: "Image alt text"
  },
  whyVerticalGardens: {
    title: "Section title",
    subtitle: "Section description",
    benefits: [
      { title: "Benefit title", description: "Benefit description" },
      // ... more benefits
    ]
  },
  tapestryDifference: {
    title: "Section title", 
    subtitle: "Section description",
    features: [
      { title: "Feature title", description: "Feature description" },
      // ... more features
    ]
  },
  livingSculpture: {
    title: "Section title",
    description: "Section description",
    image: "Image path",
    imageAlt: "Image alt text"
  },
  faqs: [
    { question: "FAQ question", answer: "FAQ answer" },
    // ... more FAQs
  ]
}
```

## Technical Implementation

### Authentication
- The CMS uses the existing admin authentication system
- Sessions are maintained across page refreshes
- Automatic logout handling

### Data Persistence
- Content is stored in Redis with the key `home:content`
- Default content is returned if no custom content exists
- Fallback mechanisms ensure the site always displays content

### Image Storage
- Images are uploaded to `/public/images/`
- Filename format: `fieldname-timestamp-random.extension`
- Automatic file validation (images only, 5MB limit)

### Error Handling
- Graceful fallbacks if Redis is unavailable
- User-friendly error messages
- Automatic retry mechanisms

## Troubleshooting

### Common Issues

1. **Changes not appearing on the website**
   - Make sure you clicked "Save Changes"
   - Check if there are any error messages
   - Try refreshing the page

2. **Image upload failing**
   - Check file size (must be under 5MB)
   - Ensure file is a valid image format
   - Check if you have proper admin permissions

3. **CMS not loading**
   - Verify you're logged in as admin
   - Check if Redis is connected
   - Look for error messages in the browser console

### Default Content Reset
If you need to restore the original content:
1. Go to the Content Management page
2. Click "Reset to Default" 
3. Confirm the action
4. The original content will be restored

## Security

- All CMS endpoints require admin authentication
- File uploads are restricted to image types only
- Input validation on all form fields
- CSRF protection through cookie-based authentication

## Best Practices

1. **Regular Backups**: Save important content changes externally
2. **Image Optimization**: Use appropriately sized images to maintain site performance
3. **Content Testing**: Preview changes on the live site after saving
4. **SEO Considerations**: Keep meta descriptions and alt text meaningful
5. **Mobile Testing**: Verify content displays well on mobile devices

## Support

For technical issues or questions about the CMS:
1. Check the browser console for error messages
2. Verify Redis connection status
3. Ensure proper admin authentication
4. Contact the development team if issues persist
