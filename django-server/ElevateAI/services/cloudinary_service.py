import cloudinary
import cloudinary.uploader
from django.conf import settings
import logging
import re

logger = logging.getLogger(__name__)


class CloudinaryService:
    """Cloudinary service for image upload and management"""
    
    def __init__(self):
        # Configure Cloudinary
        cloudinary.config(
            cloud_name=getattr(settings, 'CLOUDINARY_CLOUD_NAME', ''),
            api_key=getattr(settings, 'CLOUDINARY_API_KEY', ''),
            api_secret=getattr(settings, 'CLOUDINARY_API_SECRET', '')
        )
    
    def upload_base64_image(self, base64_data, folder='Elevate AI/profile-pictures'):
        """Upload base64 image to Cloudinary"""
        try:
            result = cloudinary.uploader.upload(
                base64_data,
                folder=folder,
                transformation=[
                    {'width': 400, 'height': 400, 'crop': 'fill', 'gravity': 'face'},
                    {'quality': 'auto'}
                ]
            )
            return result
        except Exception as error:
            logger.error(f"Error uploading base64 image to Cloudinary: {error}")
            raise error
    
    def upload_profile_picture(self, file):
        """Upload profile picture to Cloudinary"""
        try:
            result = cloudinary.uploader.upload(
                file,
                folder='Elevate AI/profile-pictures',
                transformation=[
                    {'width': 400, 'height': 400, 'crop': 'fill', 'gravity': 'face'},
                    {'quality': 'auto'}
                ]
            )
            return result
        except Exception as error:
            logger.error(f"Error uploading profile picture to Cloudinary: {error}")
            raise error
    
    def upload_project_image(self, file):
        """Upload project image to Cloudinary"""
        try:
            result = cloudinary.uploader.upload(
                file,
                folder='Elevate AI/project-images',
                transformation=[
                    {'width': 800, 'height': 600, 'crop': 'fill'},
                    {'quality': 'auto'}
                ]
            )
            return result
        except Exception as error:
            logger.error(f"Error uploading project image to Cloudinary: {error}")
            raise error
    
    def upload_certificate_image(self, file):
        """Upload certificate image to Cloudinary"""
        try:
            result = cloudinary.uploader.upload(
                file,
                folder='Elevate AI/certificates',
                transformation=[
                    {'width': 800, 'height': 600, 'crop': 'fill'},
                    {'quality': 'auto'}
                ]
            )
            return result
        except Exception as error:
            logger.error(f"Error uploading certificate image to Cloudinary: {error}")
            raise error
    
    def delete_image(self, public_id_or_url):
        """Delete image from Cloudinary"""
        try:
            # If it's a URL, extract the public ID
            if public_id_or_url.startswith('http'):
                public_id = self._extract_public_id(public_id_or_url)
                if not public_id:
                    logger.warning(f"Could not extract public ID from URL: {public_id_or_url}")
                    return None
            else:
                public_id = public_id_or_url
            
            logger.info(f"Attempting to delete image with public ID: {public_id}")
            result = cloudinary.uploader.destroy(public_id)
            logger.info(f"Cloudinary delete result: {result}")
            return result
        except Exception as error:
            logger.error(f"Error deleting image from Cloudinary: {error}")
            raise error
    
    def _extract_public_id(self, url):
        """Extract public ID from Cloudinary URL"""
        if not url or 'cloudinary.com' not in url:
            return None
        
        try:
            # Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
            # or: https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.{format}
            url_parts = url.split('/')
            upload_index = url_parts.index('upload') if 'upload' in url_parts else -1
            
            if upload_index == -1:
                return None
            
            # Get all parts after 'upload'
            after_upload = url_parts[upload_index + 1:]
            
            # Skip version number if present (starts with 'v' followed by digits)
            start_index = 0
            if after_upload and after_upload[0].startswith('v') and re.match(r'^\d+$', after_upload[0][1:]):
                start_index = 1
            
            # Join all remaining parts to get the full public ID with folder structure
            public_id_with_format = '/'.join(after_upload[start_index:])
            
            if not public_id_with_format:
                return None
            
            # Remove file extension to get public ID
            last_slash_index = public_id_with_format.rfind('/')
            if last_slash_index != -1:
                folder_path = public_id_with_format[:last_slash_index]
                filename = public_id_with_format[last_slash_index + 1:]
                public_id = filename.split('.')[0]
                return f"{folder_path}/{public_id}"
            else:
                # No folder structure, just filename
                return public_id_with_format.split('.')[0]
        except Exception as error:
            logger.error(f"Error extracting public ID from URL: {url}, {error}")
            return None
