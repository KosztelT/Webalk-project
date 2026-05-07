package io.webalk.animal_shelter_api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnimalListDTO {
    private Long id;
    private String name;
    private String species;
    private String breed;
    private String imageUrl;
    private String gender;
    private String status;
    private int age;
}
