// TODO: Add resolvers for cat
// 1. Queries
// 1.1. cats
// 1.2. catById
// 1.3. catsByOwner
// 1.4. catsByArea
// 2. Mutations
// 2.1. createCat
// 2.2. updateCat
// 2.3. deleteCat
import { Cat } from '../../interfaces/Cat';
import rectangleBounds from '../../utils/rectangleBounds';
import catModel from '../models/catModel';

export default {
  Query: {
    cats: async () => {
      try {
        return await catModel.find();
      } catch (error) {
        console.error("Error fetching cats:", error);
        throw new Error("Failed to fetch cats");
      }
    },

    catById: async (_parent: undefined, args: { id: string }) => {
      try {
        return await catModel.findById(args.id);
      } catch (error) {
        console.error(`Error fetching cat by ID ${args.id}:`, error);
        throw new Error("Failed to fetch cat by ID");
      }
    },

    catsByOwner: async (_parent: undefined, args: {ownerId: String}) => {
      try {
        return await catModel.find({ owner: args.ownerId});
      } catch (error) {
        console.error(`Error fetching cats for owner ${args.ownerId}:`, error);
        throw new Error("Failed to fetch cats by owner");
      }
    },

    catsByArea: async (_parent: undefined, args: { topRight: { type: string, lat: number, lng: number }, bottomLeft: { type: string, lat: number, lng: number }}) => {
      try {
        // Parse the topRight and bottomLeft from the query parameters
        const topRight = {
          lat: args.topRight.lat,  // Latitude first
          lng: args.topRight.lng   //Longitude second
      };
      const bottomLeft = {
        lat: args.bottomLeft.lat,  // Latitude first
        lng: args.bottomLeft.lng   //Longitude second
      };
      console.log(topRight, bottomLeft);
      // Create a Polygon using the utility function
      const polygonCoordinates = rectangleBounds(topRight, bottomLeft);
        return await catModel.find({
          location: {
            $geoWithin: {
                $geometry: polygonCoordinates,
            },
        },
        });
      } catch (error) {
        console.error(`Error fetching cats in area ${args}:`, error);
        throw new Error("Failed to fetch cats by area");
      }
    },
  },

  Mutation: {
    createCat: async (_parent: undefined, args: Cat) => {
      try {
        const cat = new catModel(args);
        return await cat.save();
      } catch (error) {
        console.error("Error creating cat:", error);
        throw new Error("Failed to create cat");
      }
    },

    updateCat: async (_parent: undefined, args: Cat) => {
      try {
        return await catModel.findByIdAndUpdate(args.id, args, {
          new: true,
        });
      } catch (error) {
        console.error("Error updating cat:", error);
        throw new Error("Failed to update cat");
      }
    },

    deleteCat: async (_parent: undefined, args: { id: string }) => {
      try {
        return await catModel.findByIdAndDelete(args.id);
      } catch (error) {
        console.error("Error deleting cat:", error);
        throw new Error("Failed to delete cat");
      }
    },
  },
};
