import { Thoughts, User } from '../models/index.js';
import { Request, Response } from 'express';



  export const getThoughts = async (_req: Request, res: Response) => {
    try {
      const applications = await Thoughts.find();
      res.json(applications);
    } catch (err) {
      res.status(500).json(err);
    }
  }


  export const getSingleThought = async (req: Request, res: Response) => {
    try {
      const thought = await Thoughts.findOne({ _id: req.params.thoughtsId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
      return;
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  }


  export const createThought = async (req: Request, res: Response) => {
    try {
      const thought = await Thoughts.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'Thoughts created, but found no user with that ID',
        })
      }

      res.json('Created the thought 🎉');
      return;
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
      return;
    }
  }

  export const updateThought = async (req: Request, res: Response) => {
    try {
      const thought = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtsId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought);
      return;
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
      return;
    }
  }

  export const deleteThought = async (req: Request, res: Response) => {
    try {

      const thought = await Thoughts.findOneAndDelete({ _id: req.params.thoughtsId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtsId },
        { $pull: { thoughts: req.params.thoughtsId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'Thought created but no user with this id!',
        });
      }

      res.json({ message: 'Thought successfully deleted!' });
      return;
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  }


  export const addReaction = async (req: Request, res: Response) => {
    try {
      const thought = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtsId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought);
      return;
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  }


  export const removeReaction = async (req: Request, res: Response) => {
    try {
      const thought = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtsId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json({ message: 'Reaction was deleted!' });
      return;
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  }

