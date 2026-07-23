import multer from "multer";
import path from "path";
import express from "express";

const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    return cd(null, "/uploads");
  },
  filename: function (req, filename, cd) {
    const uniquename = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cd(null,uniquename+path.extname(file.originalname));
  },
});

export const upload = multer({
    storage
});
