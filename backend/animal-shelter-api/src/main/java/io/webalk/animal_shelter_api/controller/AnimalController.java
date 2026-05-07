package io.webalk.animal_shelter_api.controller;

import io.webalk.animal_shelter_api.dto.AnimalCreateDTO;
import io.webalk.animal_shelter_api.dto.AnimalUpdateDTO;
import io.webalk.animal_shelter_api.model.Animal;
import io.webalk.animal_shelter_api.service.AnimalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/animals")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AnimalController {

    private final AnimalService animalService;

    @GetMapping
    public List<Animal> getAllAnimals() {
        return animalService.getAllAnimals();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Animal> getAnimalById(@PathVariable Long id) {
        return ResponseEntity.ok(animalService.getAnimalById(id));
    }

    @PostMapping
    public ResponseEntity<Animal> createAnimal(@Valid @RequestBody AnimalCreateDTO dto) {
        Animal savedAnimal = animalService.createAnimal(dto);
        return new ResponseEntity<>(savedAnimal, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Animal> updateAnimal(@PathVariable Long id, @RequestBody AnimalUpdateDTO dto) {
        return ResponseEntity.ok(animalService.updateAnimal(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnimal(@PathVariable Long id) {
        animalService.deleteAnimal(id);
        return ResponseEntity.noContent().build();
    }
}
