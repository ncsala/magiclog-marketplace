import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { ProductService } from '../../../../application/services/productServices';
import { ProductRepositoryImpl } from '../../../repositories/productRepositoryImpl';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleValidationMiddleware';
import { UserRole } from '../../../../domain/entities/userRoles';
import { UserRepositoryImpl } from '../../../repositories/userRepositoryImpl';

const router = Router();
const userRepository = new UserRepositoryImpl();
const productRepository = new ProductRepositoryImpl();
const productService = new ProductService(productRepository, userRepository);
const productController = new ProductController(productService);

router.post('/', authMiddleware, roleMiddleware([UserRole.VENDEDOR]), (req, res, next) => productController.createProduct(req as any, res, next));
router.get('/', authMiddleware, roleMiddleware([UserRole.VENDEDOR]), (req, res, next) => productController.getSellerProducts(req as any, res, next));
router.get('/search', (req, res, next) => productController.searchProducts(req, res, next));
router.get('/all', authMiddleware, roleMiddleware([UserRole.ADMINISTRADOR]), (req, res, next) => productController.getAllProducts(req, res, next));
router.get('/max-price', (req, res, next) => productController.getMaxPrice(req, res, next));
router.get('/vendors', (req, res, next) => productController.getVendors(req, res, next));

export default router;