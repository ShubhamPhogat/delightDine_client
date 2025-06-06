import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { statuses } from "../utils/styles";
import Spinner from "./Spinner";
import { FaCloudUploadAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  alertDanger,
  alertInfo,
  alertNULL,
  alertSuccess,
} from "../context/actions/alertActions";
import { buttonClick } from "../animations";
import { MdDelete } from "react-icons/md";
import LinearBuffer from "./ProgressBar";
import { addNewProduct, getAllProduct } from "../api/index";
import { setAllProducts } from "../context/actions/productAction";

const DBNewItems = () => {
  const [itemName, setItemName] = useState("");
  const [Price, setPrice] = useState("");
  const [Stock, setStock] = useState("");
  const [Tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [Progress, setProgress] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("");

  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const deleteImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    dispatch(alertInfo("Image removed"));
    setTimeout(() => dispatch(alertNULL()), 3000);
  };

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !Tags.includes(newTag)) {
      setTags([...Tags, newTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(Tags.filter((t) => t !== tag));
  };

  const saveFileData = async () => {
    if (!itemName || !Price || !category || !imageFile || !Stock) {
      dispatch(alertDanger("Please fill in all fields and upload an image."));
      setTimeout(() => dispatch(alertNULL()), 3000);
      return;
    }

    setIsLoading(true);
    setProgress(20);

    const formData = new FormData();
    formData.append("productName", itemName);
    formData.append("productPrice", Price);
    formData.append("productStock", Stock);
    formData.append("productCategory", category);
    formData.append("productTags", JSON.stringify(Tags));
    formData.append("productImage", imageFile);

    try {
      setProgress(50);
      await addNewProduct(formData);
      setProgress(80);

      dispatch(alertSuccess("New item added"));
      setTimeout(() => dispatch(alertNULL()), 2000);

      setItemName("");
      setPrice("");
      setCategory("");
      setStock("");
      setTags([]);
      setTagInput("");
      setImageFile(null);
      setPreviewUrl(null);

      const data = await getAllProduct();
      dispatch(setAllProducts(data));
    } catch (error) {
      dispatch(alertDanger("Error saving data"));
      console.error(error);
    } finally {
      setIsLoading(false);
      setProgress(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-6 px-24 w-full">
      <div className="border border-gray-300 rounded-md p-4 w-full flex flex-col items-center justify-center gap-4">
        <InputValueField
          type="text"
          placeholder="Item name here"
          stateFunc={setItemName}
          stateValue={itemName}
        />

        <div className="w-full flex items-center justify-around gap-3 flex-wrap">
          {statuses &&
            statuses.map((data) => (
              <p
                key={data.id}
                onClick={() => setCategory(data.category)}
                className={`px-4 py-3 rounded-md text-xl font-semibold cursor-pointer hover:shadow-xl border border-gray-200 backdrop-blur-md ${
                  data.category === category
                    ? "bg-red-400 text-primary shadow-red-200"
                    : "bg-none"
                }`}
              >
                {data.title}
              </p>
            ))}
        </div>

        <InputValueField
          type="number"
          placeholder="Item price here"
          stateFunc={setPrice}
          stateValue={Price}
        />

        <InputValueField
          type="number"
          placeholder="Item stock here"
          stateFunc={setStock}
          stateValue={Stock}
        />

        {/* Tag Input */}
        <div className="w-full flex items-center gap-3">
          <input
            type="text"
            placeholder="Enter tag and click Add"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="flex-1 px-4 py-3 bg-lightOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400"
          />
          <motion.button
            {...buttonClick}
            onClick={handleAddTag}
            className="px-4 py-3 bg-red-400 text-white rounded-md shadow-md hover:bg-red-600"
          >
            Add
          </motion.button>
        </div>

        {/* Tag List */}
        <div className="w-full flex flex-wrap gap-2">
          {Tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-red-100 rounded-full"
            >
              <span className="text-sm">{tag}</span>
              <MdDelete
                onClick={() => handleRemoveTag(tag)}
                className="text-red-500 cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Image Upload */}
        <div className="w-full bg-card h-300 rounded-md shadow-md border-gray-300 border-dotted cursor-pointer">
          {isLoading ? (
            <div className="w-full h-full flex items-center py-24 justify-center">
              <Spinner />
              <LinearBuffer />
            </div>
          ) : (
            <>
              {!previewUrl ? (
                <label>
                  <div className="flex flex-col items-center justify-center h-full w-full cursor-pointer">
                    <div className="flex flex-col items-center justify-center cursor-pointer">
                      <p className="font-bold text-4xl">
                        <FaCloudUploadAlt />
                      </p>
                      <p className="text-lg text-textColor">
                        Click to upload an image
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    name="upload-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-0 h-0"
                  />
                </label>
              ) : (
                <div className="relative w-full h-full overflow-hidden rounded-md">
                  <motion.img
                    whileHover={{ scale: 1.15 }}
                    src={previewUrl}
                    className="w-full h-full object-cover"
                  />
                  <motion.button
                    {...buttonClick}
                    type="button"
                    className="absolute top-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out"
                    onClick={deleteImage}
                  >
                    <MdDelete />
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>

        <motion.button
          {...buttonClick}
          onClick={saveFileData}
          className="w-9/12 py-2 rounded-md shadow-md bg-red-400 hover:bg-red-600 cursor-pointer text-primary"
        >
          Save
        </motion.button>
      </div>
    </div>
  );
};

export const InputValueField = ({
  type,
  placeholder,
  stateValue,
  stateFunc,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-lightOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400"
      value={stateValue}
      onChange={(e) => stateFunc(e.target.value)}
    />
  );
};

export default DBNewItems;
