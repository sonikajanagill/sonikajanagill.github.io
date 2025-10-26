#!/usr/bin/env python3
"""Crop logos by 10% on all sides"""
from PIL import Image
import os

def crop_image(input_path, output_path, crop_percent=10):
    """Crop image by percentage on all sides"""
    img = Image.open(input_path)
    width, height = img.size
    
    # Calculate crop amount (10% from each side = 20% total from each dimension)
    crop_left = int(width * crop_percent / 100)
    crop_top = int(height * crop_percent / 100)
    crop_right = width - crop_left
    crop_bottom = height - crop_top
    
    # Crop the image
    cropped = img.crop((crop_left, crop_top, crop_right, crop_bottom))
    
    # Save with high quality
    cropped.save(output_path, quality=95)
    print(f"Cropped {input_path} ({width}x{height}) -> {output_path} ({cropped.size[0]}x{cropped.size[1]})")

# Crop both logos
crop_image('img/Sonika-Logo-Light.jpeg', 'img/Sonika-Logo-Light.jpeg', 10)
crop_image('img/Sonika-Logo-Dark.jpeg', 'img/Sonika-Logo-Dark.jpeg', 10)

print("✓ Both logos cropped successfully!")
