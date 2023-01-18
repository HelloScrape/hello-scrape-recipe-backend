import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const recipeFileSchema = new Schema(
  {
    pdfName: { type: String, required: true, index: true },
    language: { type: String, required: true, index: true },
    weekName: { type: String, required: true, index: true },
    weekNameFolder: { type: String, required: true, index: false },
  },
  {
    timestamps: {
      currentTime: () => Date.now(),
    },
  }
);

type recipeFileSchemaType = {
  _id?: any;
  pdfName: string;
  language: string;
  weekName: string;
  weekNameFolder: string;
};

export default mongoose.model('recipeFile', recipeFileSchema);
export { recipeFileSchemaType };
