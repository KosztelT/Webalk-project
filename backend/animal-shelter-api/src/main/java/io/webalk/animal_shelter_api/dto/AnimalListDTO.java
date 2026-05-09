package io.webalk.animal_shelter_api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnimalListDTO {
    private Long id;
    private String name;
    private String species;
    private String breed;
    private List<String> imageUrls;
    private String gender;
    private String status;
    private Integer age;
    private String description;
}
