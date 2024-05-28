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
    <div>
      <div>
        <Stepper index={currentStep}>
          {steps.map((step, index) => (
            <Step key={step.id}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  active={<StepNumber />}
                  incomplete={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>
      </div>
    </div>
  );
}

export default CheckOutSteps;
