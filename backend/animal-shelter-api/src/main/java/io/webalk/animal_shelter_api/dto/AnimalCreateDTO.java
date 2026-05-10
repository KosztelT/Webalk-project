package io.webalk.animal_shelter_api.dto;

import io.webalk.animal_shelter_api.enums.Gender;
import io.webalk.animal_shelter_api.enums.Species;
import io.webalk.animal_shelter_api.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnimalCreateDTO {
    @NotBlank(message = "A név kötelező")
    private String name;
    @NotNull(message = "A faj kötelező")
    private Species species;
    private String breed;
    @NotNull(message = "A nem kötelező")
    private Gender gender;
    @NotNull(message = "A születési dátum kötelező")
    @PastOrPresent(message = "A dátum nem lehet jövőben")
    private LocalDate birthDate;
    private Status status;
    @NotBlank(message = "A leírás kötelező")
    private String description;
    private Integer age;
}
