// TODO: Add resolvers for user
// 1. Queries
// 1.1. users
// 1.2. userById
// 2. Mutations
// 2.1. createUser
// 2.2. updateUser
// 2.3. deleteUser
import { Cat } from '../../interfaces/Cat';
import { User } from '../../interfaces/User';
import userModel from '../models/userModel';

export default {
  Cat: {
    owner: async (parent: Cat) => {
      console.log(parent);
      return await userModel.findById(parent.owner);
    },
  },
  Query: {
    users: async () => {
      try {
        return await userModel.find();
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    },

    userById: async (_parent: undefined, args: { id: string }) => {
      try {
        return await userModel.findById(args.id);
      } catch (error) {
        console.error(`Error fetching user by ID ${args.id}:`, error);
        throw new Error("Failed to fetch user by ID");
      }
    },
  },

  Mutation: {
    createUser: async (_parent: undefined, args: User) => {
      try {
        const user = new userModel(args);
        return await user.save();
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
      }
    },

    updateUser: async (_parent: undefined, args: User) => {
      try {
        return await userModel.findByIdAndUpdate(args.id, args, {
          new: true,
        });
      } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user");
      }
    },

    deleteUser: async (_parent: undefined, args: { id: string }) => {
      try {
        return await userModel.findByIdAndDelete(args.id);
      } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user");
      }
    },
  },
};
