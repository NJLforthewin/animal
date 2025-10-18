import { Schema, model } from 'mongoose';

const contactSchema = new Schema({
    contact_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Contact = model('Contact', contactSchema);

export default Contact;