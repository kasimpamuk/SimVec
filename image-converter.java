import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class ImageConverter {

    public static void convertToPng(String inputImagePath, String outputImagePath) {
        try {
            // Read the image file
            File inputFile = new File(inputImagePath);
            BufferedImage image = ImageIO.read(inputFile);

            // Write the image as a PNG file
            File outputFile = new File(outputImagePath);
            ImageIO.write(image, "PNG", outputFile);

            System.out.println("Conversion completed: " + outputImagePath);
        } catch (IOException e) {
            System.out.println("Error during conversion: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        // Example usage
        String inputImagePath = "pathto/your/input/image.jpg"; 
        String outputImagePath = "path/to/your/output/image.png"; 

        convertToPng(inputImagePath, outputImagePath);
    }
}
