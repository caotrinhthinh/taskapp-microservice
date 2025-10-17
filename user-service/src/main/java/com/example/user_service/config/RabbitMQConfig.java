package com.example.user_service.config;

import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.core.Binding;

@Configuration
public class RabbitMQConfig {
    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.queue.user-events}")
    private String userEventsQueue;

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(exchangeName);
    }

    @Bean
    public Queue userEventsQueue() {
        return new Queue(userEventsQueue, true);
    }

    // Tự động chuyển đổi object <-> JSON
    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public Binding bindingUserCreated(Queue userEventsQueue, TopicExchange exchange,
            @Value("${rabbitmq.routing.key.user-created}") String createdKey) {
        return BindingBuilder.bind(userEventsQueue).to(exchange).with(createdKey);
    }

    @Bean
    public Binding bindingUserUpdated(Queue userEventsQueue, TopicExchange exchange,
            @Value("${rabbitmq.routing.key.user-updated}") String updatedKey) {
        return BindingBuilder.bind(userEventsQueue).to(exchange).with(updatedKey);
    }

    @Bean
    public Binding bindingUserDeleted(Queue userEventsQueue, TopicExchange exchange,
            @Value("${rabbitmq.routing.key.user-deleted}") String deletedKey) {
        return BindingBuilder.bind(userEventsQueue).to(exchange).with(deletedKey);
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
