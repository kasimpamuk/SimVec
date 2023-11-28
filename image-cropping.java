import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import javax.imageio.ImageIO;

public class ImageCropper {

    public static void main(String[] args) {
        // Replace "path/to/your/image.jpg" with the actual path to your image file
        String imagePath = "./input-image.jpg";

        // Set the coordinates and dimensions of the rectangle to be cropped
        int x = 100; // X-coordinate of the top-left corner of the rectangle
        int y = 150; // Y-coordinate of the top-left corner of the rectangle
        int width = 300; // Width of the rectangle
        int height = 200; // Height of the rectangle

        try {
            // Read the original image
            BufferedImage originalImage = ImageIO.read(new File(imagePath));

            // Crop the image using the specified coordinates and dimensions
            BufferedImage croppedImage = originalImage.getSubimage(x, y, width, height);

            // Save the cropped image to a new file
            String outputPath = "./output-image.jpg";
            ImageIO.write(croppedImage, "jpg", new File(outputPath));

            System.out.println("Image cropped successfully and saved to: " + outputPath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
