package io.webalk.animal_shelter_api.service;

import io.webalk.animal_shelter_api.dto.AnimalCreateDTO;
import io.webalk.animal_shelter_api.dto.AnimalListDTO;
import io.webalk.animal_shelter_api.dto.AnimalUpdateDTO;
import io.webalk.animal_shelter_api.enums.Status;
import io.webalk.animal_shelter_api.model.Animal;
import io.webalk.animal_shelter_api.model.AnimalImage;
import io.webalk.animal_shelter_api.repository.AnimalImageRepository;
import io.webalk.animal_shelter_api.repository.AnimalRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnimalService {

    private final AnimalRepository animalRepository;

    private final AnimalImageRepository animalImageRepository;

    private final String UPLOAD_DIR = "uploads/animal-images/";

    public List<AnimalListDTO> getAllAnimals() {
        String baseUrl = "http://localhost:8080/uploads/animal-images/";

        return animalRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Animal createAnimal(AnimalCreateDTO dto, MultipartFile[] files) throws IOException {
        Animal animal = new Animal();
        animal.setName(dto.getName());
        animal.setSpecies(dto.getSpecies());
        animal.setBreed(dto.getBreed());
        animal.setBirthDate(dto.getBirthDate());
        animal.setDescription(dto.getDescription());
        animal.setGender(dto.getGender());
        animal.setStatus(Status.AVAILABLE);
        animal.setAge(dto.getAge());

        Animal savedAnimal = animalRepository.save(animal);

        if(files != null && files.length > 0) {
            for (MultipartFile file : files) {
                if(!file.isEmpty()) {
                    validateImage(file);
                    String fileName = saveFileToDisk(file);

                    AnimalImage image = new AnimalImage();
                    image.setFilePath(fileName);
                    image.setAnimal(savedAnimal);

                    animalImageRepository.save(image);
                }
            }
        }

        return animalRepository.save(animal);

    }


    @Transactional
    public AnimalListDTO getAnimalById(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Állat nem található ezzel az ID-val!"));
        return convertToDTO(animal);
    }

    @Transactional
    public void deleteAnimal(Long id) throws IOException {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Nem törölhető, ilyen állat nem létezik!"));

            if (animal.getImages() != null && !animal.getImages().isEmpty()) {
                for (AnimalImage image : animal.getImages()) {
                    Path filePath = Paths.get("uploads/animal-images/").resolve(image.getFilePath());
                    System.out.println(filePath.toAbsolutePath());
                    Files.deleteIfExists(filePath);
                }
            }

        animalRepository.delete(animal);
    }

    @Transactional
    public AnimalListDTO updateAnimal(Long id, AnimalUpdateDTO dto, MultipartFile[] files) throws IOException {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Állat nem található ilyen ID-val"));

        if (dto.getName() != null) animal.setName(dto.getName());
        if (dto.getSpecies() != null) animal.setSpecies(dto.getSpecies());
        if (dto.getBreed() != null) animal.setBreed(dto.getBreed());
        if (dto.getGender() != null) animal.setGender(dto.getGender());
        if (dto.getBirthDate() != null) animal.setBirthDate(dto.getBirthDate());
        if (dto.getDescription() != null) animal.setDescription(dto.getDescription());
        if (dto.getAge() != null) animal.setAge(dto.getAge());

        if (files != null && files.length > 0) {

            if (animal.getImages() != null) {
                for (AnimalImage oldImage : animal.getImages()) {
                    Path oldPath = Paths.get("uploads/animal-images/").resolve(oldImage.getFilePath()).normalize();
                    Files.deleteIfExists(oldPath);
                }

                animal.getImages().clear();

                animalRepository.saveAndFlush(animal);
            }

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    validateImage(file);
                    String fileName = saveFileToDisk(file);
                    AnimalImage image = new AnimalImage();
                    image.setFilePath(fileName);
                    image.setAnimal(animal);

                    animal.getImages().add(image);
                }
            }
        }

        Animal updatedAnimal = animalRepository.save(animal);

        return convertToDTO(updatedAnimal);
    }

    @Transactional
    private String saveFileToDisk(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }

    @Transactional
    private AnimalListDTO convertToDTO(Animal animal) {
        String baseUrl = "http://localhost:8080/uploads/animal-images/";
        AnimalListDTO dto = new AnimalListDTO();

        dto.setId(animal.getId());
        dto.setName(animal.getName());
        dto.setSpecies(animal.getSpecies().toString());
        dto.setBreed(animal.getBreed());
        dto.setGender(animal.getGender().toString());
        dto.setStatus(animal.getStatus().toString());
        dto.setAge(animal.getAge());
        dto.setDescription(animal.getDescription());

        List<String> urls = animal.getImages().stream()
                .map(img -> baseUrl + img.getFilePath())
                .collect(Collectors.toList());

        dto.setImageUrls(urls);


        return dto;
    }

    private void validateImage(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
            throw new IllegalArgumentException("Csak JPG és PNG formátumú képek tölthetőek fel!");
        }

        String fileName = file.getOriginalFilename();
        if (fileName == null || (!fileName.toLowerCase().endsWith(".jpg") &&
                !fileName.toLowerCase().endsWith(".jpeg") &&
                !fileName.toLowerCase().endsWith(".png"))) {
            throw new IllegalArgumentException("A fájl kiterjesztése nem megfelelő!");
        }
    }

}
