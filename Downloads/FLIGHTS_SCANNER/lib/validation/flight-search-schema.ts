import { z } from "zod";

export const iataSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, "Use a valid IATA code (3 letters)");

export const comparisonLocationSchema = z.enum([
  "BASELINE",
  "INDIA",
  "SOUTH_AFRICA",
  "MEXICO",
  "BRAZIL",
  "THAILAND",
  "PHILIPPINES",
  "VIETNAM",
  "COLOMBIA",
  "INDONESIA",
  "MALAYSIA",
  "CUSTOM",
]);

export const flightSearchSchema = z
  .object({
    originIata: iataSchema,
    destinationIata: iataSchema,
    departureDate: z.string().date(),
    returnDate: z.string().date().optional(),
    tripType: z.enum(["ONE_WAY", "ROUND_TRIP"]),
    adults: z.number().int().min(1).max(9),
    cabinClass: z.enum(["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"]),
    directOnly: z.boolean(),
    preferredCurrency: z.string().length(3).toUpperCase(),
    maxResults: z.number().int().min(1).max(50),
  })
  .superRefine((value, ctx) => {
    if (value.originIata === value.destinationIata) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Origin and destination cannot be the same",
        path: ["destinationIata"],
      });
    }
    if (value.tripType === "ROUND_TRIP" && !value.returnDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Return date is required for round-trip",
        path: ["returnDate"],
      });
    }
  });

export const comparisonRequestSchema = z.object({
  searchRequest: flightSearchSchema,
  selectedLocations: z.array(comparisonLocationSchema).min(2),
  comparisonCurrency: z.string().length(3).toUpperCase(),
});

export type FlightSearchInput = z.infer<typeof flightSearchSchema>;
export type ComparisonRequestInput = z.infer<typeof comparisonRequestSchema>;
