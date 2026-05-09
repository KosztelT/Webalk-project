package io.webalk.animal_shelter_api.controller;

import io.webalk.animal_shelter_api.dto.AnimalCreateDTO;
import io.webalk.animal_shelter_api.dto.AnimalListDTO;
import io.webalk.animal_shelter_api.dto.AnimalUpdateDTO;
import io.webalk.animal_shelter_api.model.Animal;
import io.webalk.animal_shelter_api.service.AnimalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/animals")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AnimalController {

    private final AnimalService animalService;

    @GetMapping
    public ResponseEntity<List<AnimalListDTO>> getAllAnimals() {
        List<AnimalListDTO> animals = animalService.getAllAnimals();
        return ResponseEntity.ok(animals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnimalListDTO> getAnimalById(@PathVariable Long id) {
        AnimalListDTO animal = animalService.getAnimalById(id);
        return ResponseEntity.ok(animal);
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Animal> createAnimal(
            @Valid @RequestPart("animal") AnimalCreateDTO dto,
            @RequestPart("files")MultipartFile[] files) throws IOException {
        Animal savedAnimal = animalService.createAnimal(dto, files);
        return new ResponseEntity<>(savedAnimal, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<AnimalListDTO> updateAnimal(@PathVariable Long id,
                                               @RequestPart("animal") AnimalUpdateDTO dto,
                                               @RequestPart(value = "files", required = false) MultipartFile[] files ) throws  IOException {
        AnimalListDTO updatedAnimal = animalService.updateAnimal(id, dto, files);

        return ResponseEntity.ok(updatedAnimal);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnimal(@PathVariable Long id) throws IOException {
        animalService.deleteAnimal(id);
        return ResponseEntity.noContent().build();
    }
}
