package io.webalk.animal_shelter_api.model;

import io.webalk.animal_shelter_api.enums.Gender;
import io.webalk.animal_shelter_api.enums.Species;
import io.webalk.animal_shelter_api.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "animals")
public class Animal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Species species;
    private String breed;
    private String description;
    private LocalDate birthDate;
    @Enumerated(EnumType.STRING)
    private Gender gender;
    private String imageUrl;
    @Enumerated(EnumType.STRING)
    private Status status;
}
