package io.webalk.animal_shelter_api.dto;

import io.webalk.animal_shelter_api.enums.Gender;
import io.webalk.animal_shelter_api.enums.Species;
import io.webalk.animal_shelter_api.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnimalUpdateDTO {
    private String name;
    private Species species;
    private String description;
    private String breed;
    private Gender gender;
    private LocalDate birthDate;
    private String imageUrl;
    private Status status;
}
