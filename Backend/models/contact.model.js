import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [
        /\S+@\S+\.\S+/,
        'Please enter a valid email address'
      ]
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      // If you want to restrict subjects to ONLY what is in your dropdown, uncomment the enum below:
      // enum: ['I want to Volunteer', 'Donation / Tax Receipt Query', 'Corporate CSR Partnership', 'I need assistance (Beneficiary)', 'General Inquiry', 'Support Request', 'Job Application']
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true
    },
    privacyAccepted: {
      type: Boolean,
      required: [true, 'Privacy policy must be accepted'],
      default: false,
      validate: {
        validator: function(v) {
          return v === true;
        },
        message: 'You must agree to the privacy policy'
      }
    },
    // Internal use: To track if your team has replied to this person
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Resolved', 'Spam'],
      default: 'New'
    }
  },
  {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt'
    collection: "contacts"
  }
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
