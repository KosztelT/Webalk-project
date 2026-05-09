package io.webalk.animal_shelter_api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String rootPath = System.getProperty("user.dir");
        String path = "file:" + rootPath + "/uploads/animal-images/";

        registry.addResourceHandler("/uploads/animal-images/**")
                .addResourceLocations(path);

        // Ez segíteni fog neked a debugolásban:
        System.out.println("DEBUG: A képeket itt keresem: " + path);
    }
}
