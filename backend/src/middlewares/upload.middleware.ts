import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const uploadDir = path.resolve(__dirname, '../../uploads');
const webpDir = path.join(uploadDir, 'webp');
const pdfDir = path.join(uploadDir, 'pdf');

// Ensure directories exist
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(webpDir)) fs.mkdirSync(webpDir, { recursive: true });
if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

const storage = multer.memoryStorage();

export const uploadMemory = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de archivo no soportado. Permitidos: JPG, PNG, WEBP, GIF, PDF.'));
    }
  }
});

export interface ExtendedRequest extends Request {
  fileWebpUrl?: string;
  filesWebpUrls?: string[];
  pdfUrl?: string;
}

export const processWebpAndPdf = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        const fileName = `${Date.now()}-${crypto.randomUUID()}.pdf`;
        const filePath = path.join(pdfDir, fileName);
        await fs.promises.writeFile(filePath, req.file.buffer);
        req.pdfUrl = `/uploads/pdf/${fileName}`;
      } else {
        const fileName = `${Date.now()}-${crypto.randomUUID()}.webp`;
        const filePath = path.join(webpDir, fileName);
        await sharp(req.file.buffer)
          .webp({ quality: 85, effort: 4 })
          .toFile(filePath);
        req.fileWebpUrl = `/uploads/webp/${fileName}`;
      }
    }

    if (req.files) {
      const filesArray = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
      const webpUrls: string[] = [];

      for (const file of filesArray) {
        if (file.mimetype === 'application/pdf') {
          const fileName = `${Date.now()}-${crypto.randomUUID()}.pdf`;
          const filePath = path.join(pdfDir, fileName);
          await fs.promises.writeFile(filePath, file.buffer);
          req.pdfUrl = `/uploads/pdf/${fileName}`;
        } else {
          const fileName = `${Date.now()}-${crypto.randomUUID()}.webp`;
          const filePath = path.join(webpDir, fileName);
          await sharp(file.buffer)
            .webp({ quality: 85, effort: 4 })
            .toFile(filePath);
          webpUrls.push(`/uploads/webp/${fileName}`);
        }
      }

      req.filesWebpUrls = webpUrls;
    }

    next();
  } catch (error) {
    console.error('Error al procesar archivo:', error);
    res.status(500).json({ success: false, message: 'Error durante la optimización del archivo.' });
  }
};
