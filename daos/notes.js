const mongoose = require("mongoose");
const User = require("../models/user");
const Token = require("../models/token");
const Note = require("../models/note");

module.exports = {};

// create a note
module.exports.createNote = async (text, userId) => {
  try {
  const noteText = text.text;
        const newNote = await Note.create({text: noteText, userId: userId});
        return newNote;
  } catch (e) {
    if (e.message.includes("Failed")) {
      throw new BadDataError(e.message);
    }
    throw e;
  }
};

// get all notes
module.exports.getNotes = async (userId) => {
  try {
        const retrievedNotes = await Note.find({userId: userId});
        return retrievedNotes;
  } catch (e) {
    if (e.message.includes("Failed")) {
      throw new BadDataError(e.message);
    }
    throw e;
  }
};

//find a specific note
module.exports.getSingleNote = async (noteId, userId) => {
  try {
        const retrievedNote = await Note.findOne({_id: noteId,userId: userId});
        if (retrievedNote !== null || !retrievedNote) {
        return retrievedNote;
        }
        else {
            return false
        }
  } catch (e) {
    if (e.message.includes("Failed")) {
      throw new BadDataError(e.message);
    }
    throw e;
  }
};


class BadDataError extends Error {}
module.exports.BadDataError = BadDataError;
