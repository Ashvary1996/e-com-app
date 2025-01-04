import React from "react";
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Box,
  VStack,
 
} from "@chakra-ui/react";

function CheckOutSteps({ activeStep }) {
  const steps = [
    { id: "contact-info", title: "First", description: "Contact Info" },
    { id: "shipping-Details", title: "Second", description: "Shipping-Details" },
    { id: "confirm", title: "Third", description: "Confirm Details" },
    { id: "payment-Gateway", title: "Fourth", description: "Payment" },
  ];

  const { activeStep: currentStep } = useSteps({
    index: activeStep,
    count: steps.length,
  });

  return (
    <Box
      w="full"
      px={{ base: 4, md: 8 }}
      py={{ base: 4, md: 8 }}
      maxW="container.md"
      mx="auto"
    >
      <Stepper
        index={currentStep}
        orientation={{ base: "vertical", md: "horizontal" }}
        size={{ base: "sm", md: "md" }}
        gap={{ base: 4, md: 8 }}
      >
        {steps.map((step, index) => (
          <Step key={step.id}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                active={<StepNumber />}
                incomplete={<StepNumber />}
              />
            </StepIndicator>

            <VStack
              align={{ base: "start", md: "center" }}
              spacing={{ base: 1, md: 2 }}
              flexShrink="0"
            >
              <StepTitle fontSize={{ base: "sm", md: "md" }}>
                {step.title}
              </StepTitle>
              <StepDescription fontSize={{ base: "xs", md: "sm" }}>
                {step.description}
              </StepDescription>
            </VStack>

            {index < steps.length - 1 && <StepSeparator />}
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default CheckOutSteps;
