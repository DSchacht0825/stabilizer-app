# Housing Stabilization Form - San Diego Rescue Mission

## TWO VERSIONS AVAILABLE

### 1. Basic Form (`index.html`)
Simple intake form with essential fields - good for initial contact

### 2. Comprehensive Form (`comprehensive-form.html`) 
Complete intake matching your spreadsheet with all fields:
- Basic Information (Name, DOB, Case Manager, etc.)
- Contact Information
- Housing Situation & History
- Income & Benefits (SSI, SSDI, SNAP, etc.)
- Health & Disabilities
- Services Needed (Emergency Shelter, Case Management, etc.)
- Risk/Urgency Assessment
- Supporting Documentation Upload
- Consent & Authorization

## Quick Deploy to Netlify (FREE)

### Option 1: Drag & Drop (Easiest)
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Drag the entire `housing-stabalizer-form` folder to the deploy area
3. Your form is live! Netlify will give you a URL like `https://amazing-name-123456.netlify.app`

### Option 2: Git Integration (Recommended)
1. Create a GitHub repo and push this folder
2. Connect your repo to Netlify
3. Auto-deploys on every update

## Form Features ✅

- **All required fields** with exact validation specs
- **SD Rescue branding** with official logo and colors
- **Mobile responsive** design
- **File uploads** (PDF, JPG, PNG up to 10MB each)
- **Real-time validation** with helpful error messages
- **Spam protection** with built-in reCAPTCHA
- **Character counter** for long text fields
- **Age verification** for date of birth

## Form Data Access

### View Submissions
1. Netlify Dashboard → Your Site → Forms tab
2. See all submissions in real-time
3. Download as CSV for Excel/Google Sheets

### Email Notifications
1. Netlify Dashboard → Forms → Notifications
2. Add email addresses to get notified on new submissions
3. Can integrate with Slack, Zapier, etc.

### Export Options
- **CSV download** for Excel analysis
- **JSON export** for custom reporting
- **Webhook integration** for real-time processing

## Customization

### Update Branding
- Edit logo URL in `index.html` line 97
- Modify colors in the CSS section
- Change header text as needed

### Add Fields
- Follow the existing pattern in HTML
- Add validation in the JavaScript section
- Update form name if needed

### Success/Error Pages
- Create `success.html` for custom thank you page
- Add `action="/success"` to form tag

## Cost Breakdown

- **Netlify Forms**: FREE (100 submissions/month)
- **File Storage**: FREE (100MB)
- **Domain**: $15/year (optional - use custom domain)
- **Advanced Features**: $19/month if you exceed limits

## Support

For questions about:
- **Netlify**: Check [netlify.com/docs](https://docs.netlify.com/forms/)
- **Form Modifications**: Contact your developer
- **SD Rescue Integration**: Coordinate with your IT team