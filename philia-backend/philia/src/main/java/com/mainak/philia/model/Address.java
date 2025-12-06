package com.mainak.philia.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Address {
    @NotNull(message = "Street cannot be null")
    @NotBlank(message = "Street cannot be blank")
    @Size(min = 3, max = 100, message = "Street must be between 3 and 100 characters")
    private String street;

    @NotNull(message = "City cannot be null")
    @NotBlank(message = "City cannot be blank")
    @Size(min = 2, max = 100, message = "City must be between 2 and 100 characters")
    private String city;

    @NotNull(message = "State cannot be null")
    @NotBlank(message = "State cannot be blank")
    @Size(min = 2, max = 100, message = "State must be between 2 and 100 characters")
    private String state;

    @NotNull(message = "Country cannot be null")
    @NotBlank(message = "Country cannot be blank")
    @Size(min = 2, max = 100, message = "Country must be between 2 and 100 characters")
    private String country;

    @NotNull(message = "Zipcode cannot be null")
    @NotBlank(message = "Zipcode cannot be blank")
    @Size(min = 2, max = 20, message = "Zipcode must be between 2 and 20 characters")
    private String zipCode;
}
