// models/package.model.js
const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Package name is required'] 
    },
    description: { 
      type: String, 
      required: [true, 'Package description is required'] 
    },
    price: { 
      type: Number, 
      required: [true, 'Package price is required'],
      min: [0, 'Price cannot be negative']
    },
    days: { 
      type: Number, 
      required: [true, 'Number of days is required'],
      min: [1, 'Days must be at least 1']
    },
    nights: { 
      type: Number, 
      required: [true, 'Number of nights is required'],
      min: [0, 'Nights cannot be negative']
    },
    images: [{ 
      type: String 
    }],
    imagePublicIds: [{ type: String }],

    division: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division",
      required: [true, 'Division is required'],
    },

    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      required: [true, 'District is required'],
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: [true, 'Coordinates are required'],
        validate: {
          validator: function(coords) {
            return coords.length === 2 && 
                   coords[0] >= -180 && coords[0] <= 180 && 
                   coords[1] >= -90 && coords[1] <= 90;
          },
          message: 'Invalid coordinates format [longitude, latitude]'
        }
      },
      address: { 
        type: String, 
        required: [true, 'Address is required'] 
      },
    },

    // Array fields from frontend
    itinerary: [{ 
      type: String 
    }],
    highlights: [{ 
      type: String 
    }],
    inclusions: [{ 
      type: String 
    }],
    
    // Vendor and approval fields
    vendor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, 'Vendor is required'] 
    },
    isApproved: { 
      type: Boolean, 
      default: false 
    }

  },
  { 
    timestamps: true 
  }
);

// Create 2dsphere index for geospatial queries
packageSchema.index({ location: "2dsphere" });

// Create text index for search functionality
packageSchema.index({ 
  name: 'text', 
  description: 'text',
  'location.address': 'text'
});

module.exports = mongoose.model("Package", packageSchema);