import { NextFunction, Request, Response, Router } from "express";
import StatusCodes from "http-status-codes";
import { ApiError } from "../errors/api-error";
import { Category } from "../models/category/category.model";
import { Note } from "../models/note/note.model";
import { tokenMiddleware } from "../utils/jwt";


const categoryRouter = Router();
const { OK, CREATED, BAD_REQUEST } = StatusCodes;

categoryRouter.post('/', tokenMiddleware, (req: Request, res: Response, next: NextFunction) => {
    const { name, description, image } = req.body;
    const category = {
        name,
        description,
        image,
        user_id: req.body.jwtUser._id
    };
    Category.findOne({ name, user_id: req.body.jwtUser._id }).then((categoryFound) => {
        if (!categoryFound) {
            Category.create(category).then((createdCategory) => {
                res.status(CREATED).json(createdCategory);
            });
        }
        else {
            next(ApiError.badRequest(['DUPLICATED_CATEGORY']));
        }
    });
});

categoryRouter.get('/', tokenMiddleware, (req: Request, res: Response, next: NextFunction) => {
    Category.find({ user_id: req.body.jwtUser._id }).then((categories) => {
        res.status(OK).json(categories);
    });
});

categoryRouter.get('/:id', tokenMiddleware, (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    Category.findOne({ _id: id }).then((category) => {
        if (!category) {
            next(ApiError.badRequest(['NON_EXISTENT_CATEGORY']));
        }
        else {
            res.status(OK).json(category);
        }
    });
});

categoryRouter.delete('/:id', tokenMiddleware, (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    Category.findOne({ _id: id }).then((categoryFound) => {
        if (!categoryFound) {
            next(ApiError.badRequest(['NON_EXISTENT_CATEGORY']));
        }
        else {
            Note.findOne({category: categoryFound.name}).then((noteFound)=>{
                if(!noteFound){
                    Category.deleteOne({ _id: id }).then(() => {
                        res.status(OK).json();
                    });
                }
                else {
                    next(ApiError.badRequest(['NOTES_WITH_CATEGORY']));
                }
            })
        }
    });
});

categoryRouter.patch('/:id', tokenMiddleware, (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, description, image } = req.body;
    const valueUpdated = {
        name,
        description,
        image
    };
    const condition = {
        _id: id
    }
    Category.findOne(condition).then((categoryFound) => {
        if (!categoryFound) {
            next(ApiError.badRequest(['NON_EXISTENT_CATEGORY']));
        }
        else {
            const newCategory = {
                ...categoryFound,
                ...valueUpdated
            };
            Category.findOne({ name: newCategory.name, _id: { $ne: id } }).then((duplicatedCategory) => {
                if (duplicatedCategory) {
                    next(ApiError.badRequest(['DUPLICATED_CATEGORY']));
                }
                else {
                    Category.updateOne(condition, valueUpdated, {}, (err, category) => {
                        res.status(OK).json();
                    });
                }
            })
        }
    });
});


export default categoryRouter;