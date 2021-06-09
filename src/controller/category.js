const Category = require("../models/category");
const slugify = require("slugify");
const shortid = require("shortid");
const formidable = require("formidable");
const { uploadImages } = require("../common-middleware");

function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      type: cate.type,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

exports.addCategory = (req, res) => {
  new formidable.IncomingForm({ multiple: true }).parse(
    req,
    async (error, fields, file) => {
      if (error) {
        return res.status(400).json({ error });
      } else {
        console.log({ file });

        const categoryObj = {
          name: fields.name,
          slug: `${slugify(fields.name)}-${shortid.generate()}`,
          createdBy: req.user._id,
        };
        if (file.categoryImage) {
          const urlArray = await uploadImages([file.categoryImage.path]);
          if (urlArray.length > 0) {
            categoryObj.categoryImage = urlArray[0].img;
          }
        }
        if (req.body.parentId) {
          categoryObj.parentId = req.body.parentId;
        }

        const cat = new Category(categoryObj);
        cat.save((error, category) => {
          if (error) return res.status(400).json({ error });
          if (category) {
            return res.status(201).json({ category });
          }
        });
      }
    }
  );
};

exports.getCategories = (req, res) => {
  Category.find({}).exec((error, categories) => {
    if (error) return res.status(400).json({ error });
    if (categories) {
      const categoryList = createCategories(categories);
      res.status(200).json({ categoryList });
    }
  });
};

exports.updateCategories = async (req, res) => {
  new formidable.IncomingForm({ multiples: true }).parse(
    req,
    async (error, fields, file) => {
      if (error) {
        return res.status(400).json({ error });
      } else {
        const { _id, name, parentId, type } = fields;
        const updatedCategories = [];
        if (name instanceof Array) {
          for (let i = 0; i < name.length; i++) {
            const category = {
              name: name[i],
              type: type[i],
            };
            if (parentId[i] !== "") {
              category.parentId = parentId[i];
            }

            const updatedCategory = await Category.findOneAndUpdate(
              { _id: _id[i] },
              category,
              { new: true }
            );
            updatedCategories.push(updatedCategory);
          }
          return res.status(201).json({ updateCategories: updatedCategories });
        } else {
          const category = {
            name,
            type,
          };
          if (parentId !== "") {
            category.parentId = parentId;
          }
          const updatedCategory = await Category.findOneAndUpdate(
            { _id },
            category,
            {
              new: true,
            }
          );
          return res.status(201).json({ updatedCategory });
        }
      }
    }
  );
};

exports.deleteCategories = async (req, res) => {
  const { ids } = req.body.payload;
  const deletedCategories = [];
  for (let i = 0; i < ids.length; i++) {
    const deleteCategory = await Category.findOneAndDelete({
      _id: ids[i]._id,
      createdBy: req.user._id,
    });
    deletedCategories.push(deleteCategory);
  }

  if (deletedCategories.length == ids.length) {
    res.status(201).json({ message: "Categories removed" });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
};
