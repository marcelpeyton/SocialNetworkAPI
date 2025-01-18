import {Thoughts, User} from '../models/index.js';
import { Request, Response } from 'express';


  // Get all users
  export const getUsers = async (_req: Request, res: Response) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // Get a single user
  export const getSingleUser = async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ _id: req.params.userId })   
        .populate("thoughts")
        .populate('friends');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
      return;
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  }

  // create a new user
  export const createUser = async (req: Request, res: Response) => {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // Delete a user 
  export const deleteUser = async (req: Request, res: Response) => {
    try {
      const user = await User.findById({ _id: req.params.userId });
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      await Thoughts.deleteMany({ _id: { $in: user?.thoughts } });
      await User.findOneAndDelete({ _id: req.params.userId });

      res.json({ message: 'User Deleted' })
      return;
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  }

  export const updateUser = async (req: Request, res: Response) => {
    try {
      const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      {new: true},)
      
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      res.json(user);
      return;
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  }
  //res: Response
  export const addFriend = async (req: Request, res: Response) => {
    try {
        const friend = await User.findById({ _id: req.params.friendId })
        if(friend){
          const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $push: { friends: req.params.friendId } },
            {new: true},)
          if (!user) {
            res.json({message: 'No user with that id'})
            return; // user not found
          }
          res.json(user);
          return;
        }
        res.json({message: 'No user with that id ("friend")'})
      } catch (error) {
        console.error(error);
        throw error;
      }
  }

  // res: Response
  export const removeFriend = async (req: Request, res: Response) => {
    try {
      const friend = await User.findById({ _id: req.params.friendId })
      if(friend){
        const user = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $pull: { friends: req.params.friendId }},
          {new: true})
        if (!user) {
          res.json({message: 'No user with that id'})
          return;
        }
        res.json(user);
        return;
      }
      res.json({message: 'No user with that id ("friend")'})
      } catch (error) {
        console.error(error);
        throw error;
      }
  }

