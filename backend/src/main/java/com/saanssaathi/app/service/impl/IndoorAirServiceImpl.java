package com.saanssaathi.app.service.impl;

import com.saanssaathi.app.exception.ResourceNotFoundException;
import com.saanssaathi.app.model.dto.request.IndoorAssessmentRequest;
import com.saanssaathi.app.model.dto.response.CleanAirRoomGuideDTO;
import com.saanssaathi.app.model.dto.response.DiyAirPurifierGuideDTO;
import com.saanssaathi.app.model.dto.response.IndoorAssessmentResponse;
import com.saanssaathi.app.model.dto.response.IndoorRecommendationDTO;
import com.saanssaathi.app.model.entity.IndoorAssessment;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.repository.IndoorAssessmentRepository;
import com.saanssaathi.app.repository.UserRepository;
import com.saanssaathi.app.service.IndoorAirService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class IndoorAirServiceImpl implements IndoorAirService {

    private final IndoorAssessmentRepository assessmentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public IndoorAssessmentResponse saveAssessment(Long userId, IndoorAssessmentRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        IndoorAssessment assessment = IndoorAssessment.builder()
                .user(user)
                .roomCount(request.getRoomCount() != null ? request.getRoomCount() : 2)
                .windowCount(request.getWindowCount() != null ? request.getWindowCount() : 4)
                .floorNumber(request.getFloorNumber() != null ? request.getFloorNumber() : 1)
                .totalFloors(request.getTotalFloors() != null ? request.getTotalFloors() : 4)
                .hasAirPurifier(Boolean.TRUE.equals(request.getHasAirPurifier()))
                .hasExhaustFan(Boolean.TRUE.equals(request.getHasExhaustFan()))
                .hasChimney(Boolean.TRUE.equals(request.getHasChimney()))
                .cookingFuel(request.getCookingFuel() != null ? request.getCookingFuel() : "LPG")
                .usesIncense(Boolean.TRUE.equals(request.getUsesIncense()))
                .usesMosquitoCoil(Boolean.TRUE.equals(request.getUsesMosquitoCoil()))
                .hasSmokingMember(Boolean.TRUE.equals(request.getHasSmokingMember()))
                .budgetRupees(request.getBudgetRupees() != null ? request.getBudgetRupees() : 0)
                .hasChildren(Boolean.TRUE.equals(request.getHasChildren()))
                .hasSeniors(Boolean.TRUE.equals(request.getHasSeniors()))
                .additionalNotes(request.getAdditionalNotes())
                .build();

        IndoorAssessment saved = assessmentRepository.save(assessment);
        log.info("Saved indoor assessment id: {} for user: {}", saved.getId(), userId);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public IndoorAssessmentResponse getLatestAssessment(Long userId) {
        return assessmentRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
                .map(this::mapToResponse)
                .orElseGet(this::createDefaultAssessmentResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IndoorRecommendationDTO> getRecommendations(Long userId) {
        return assessmentRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
                .map(this::generateRecommendations)
                .orElseGet(() -> generateRecommendations(createDefaultAssessment(null)));
    }

    @Override
    public CleanAirRoomGuideDTO getCleanAirRoomGuide() {
        return CleanAirRoomGuideDTO.builder()
                .title("The Clean Air Room Blueprint (EPA & NCDC Validated)")
                .subtitle("Concentrated indoor sanctuary protocol for Indian homes during severe winter smog episodes")
                .rationale("During winter smog, sealing an entire home is often impossible due to balcony doors and multiple vents. Designating one interior room creates a safe retreat that can achieve up to 80-90% lower PM2.5 levels.")
                .setupSteps(List.of(
                        CleanAirRoomGuideDTO.SetupStep.builder()
                                .stepNumber(1)
                                .title("Select the Optimal Room")
                                .description("Choose an interior bedroom with fewer exterior windows and minimal wall contact with outside streets. The master bedroom is usually best.")
                                .tip("Prefer rooms on higher floors away from ground vehicle exhaust.")
                                .build(),
                        CleanAirRoomGuideDTO.SetupStep.builder()
                                .stepNumber(2)
                                .title("Seal Window Frames & Glazing")
                                .description("Keep windows closed and latched. Apply foam weatherstripping tape or masking tape along window gaps if draft is felt.")
                                .tip("Avoid opening windows during the 6:00 AM – 10:00 AM morning temperature inversion.")
                                .build(),
                        CleanAirRoomGuideDTO.SetupStep.builder()
                                .stepNumber(3)
                                .title("Block Door Undercuts")
                                .description("Place a foam draft-stopper or a rolled damp towel across the 1-inch bottom gap under the bedroom door.")
                                .tip("Damp towels prevent aerosol infiltration from kitchen cooking smoke.")
                                .build(),
                        CleanAirRoomGuideDTO.SetupStep.builder()
                                .stepNumber(4)
                                .title("Deploy Centered Continuous Filtration")
                                .description("Position an air purifier or DIY box fan filter near the center of the room with at least 1-2 feet clearance on all sides.")
                                .tip("Run on medium/high speed 30 minutes before sleep, then low throughout the night.")
                                .build(),
                        CleanAirRoomGuideDTO.SetupStep.builder()
                                .stepNumber(5)
                                .title("Maintain 100% Zero-Combustion Discipline")
                                .description("Strictly prohibit burning incense, mosquito coils, dhoop, candles, or smoking inside or near the room doorway.")
                                .tip("Keep the door closed whenever entering or exiting.")
                                .build()
                ))
                .sizingTable(List.of(
                        CleanAirRoomGuideDTO.PurifierSizing.builder()
                                .roomCategory("Small Bedroom / Study")
                                .roomArea("Up to 120 sq ft (11 m²)")
                                .requiredCadr("100 - 150 m³/h")
                                .airChangesPerHour("4 to 5 ACH")
                                .recommendedType("Compact True HEPA H13 (35W - 45W)")
                                .build(),
                        CleanAirRoomGuideDTO.PurifierSizing.builder()
                                .roomCategory("Standard Master Bedroom")
                                .roomArea("120 - 250 sq ft (12 - 23 m²)")
                                .requiredCadr("200 - 280 m³/h")
                                .airChangesPerHour("4.5 to 5 ACH")
                                .recommendedType("Standard True HEPA with Pre-filter (50W)")
                                .build(),
                        CleanAirRoomGuideDTO.PurifierSizing.builder()
                                .roomCategory("Large Bedroom / Master Suite")
                                .roomArea("250 - 400 sq ft (23 - 37 m²)")
                                .requiredCadr("320 - 450 m³/h")
                                .airChangesPerHour("4.8 ACH")
                                .recommendedType("High CADR Dual-Intake HEPA or 2x medium units")
                                .build(),
                        CleanAirRoomGuideDTO.PurifierSizing.builder()
                                .roomCategory("Combined Hall / Living Room")
                                .roomArea("400+ sq ft (37+ m²)")
                                .requiredCadr("500+ m³/h")
                                .airChangesPerHour("3.5 to 4.5 ACH")
                                .recommendedType("Commercial-grade HEPA or Corsi-Rosenthal Cube")
                                .build()
                ))
                .doItems(List.of(
                        "Run the air purifier continuously in the Clean Air Room when outdoor AQI > 200.",
                        "Wipe surfaces with a damp microfiber cloth instead of dry dusting.",
                        "Gather children and elderly family members in this room during peak pollution hours.",
                        "Inspect and vacuum the outer mesh pre-filter every 2 weeks."
                ))
                .dontItems(List.of(
                        "Never burn incense sticks, dhoop, or mosquito coils inside the room.",
                        "Avoid dry sweeping with grass brooms which resuspends fine settled dust.",
                        "Do not leave the room door ajar while cooking in the kitchen.",
                        "Do not rely on ozone-generating or uncertified ionizer air purifiers."
                ))
                .build();
    }

    @Override
    public DiyAirPurifierGuideDTO getDIYAirPurifierGuide() {
        return DiyAirPurifierGuideDTO.builder()
                .title("EPA-Evaluated DIY Box Fan Air Filter Guide")
                .subtitle("Evidence-based, low-cost particulate cleaner using standard box fan and MERV-13 filter")
                .scientificValidation("Extensive chamber testing by the US Environmental Protection Agency (EPA) and UC Davis confirmed that a 20-inch box fan paired with a MERV-13 filter reduces airborne PM2.5 by 70–80% in 30 minutes, providing Clean Air Delivery Rates (CADR) comparable to commercial air cleaners costing ₹8,000+.")
                .estimatedCost("₹900 - ₹1,400 total")
                .filtrationEfficiency("70% - 85% reduction of fine particulate matter (PM2.5)")
                .officialCitation("US EPA Research Report on Low-Cost Box Fan Filtration (EPA/600/R-21/104)")
                .materials(List.of(
                        DiyAirPurifierGuideDTO.MaterialItem.builder()
                                .name("20-Inch Box Fan")
                                .specification("Standard 3-speed box fan with UL-507 or certified thermal fuse safety switch (manufactured 2012 or later)")
                                .approximateCost("₹750 - ₹1,100")
                                .isEssential(true)
                                .build(),
                        DiyAirPurifierGuideDTO.MaterialItem.builder()
                                .name("MERV-13 Pleated HVAC Filter")
                                .specification("Dimensions: 20\" x 20\" x 1\" (or 20\" x 20\" x 2\"). True MERV-13 captures over 85% of 1-3 µm particles.")
                                .approximateCost("₹350 - ₹600")
                                .isEssential(true)
                                .build(),
                        DiyAirPurifierGuideDTO.MaterialItem.builder()
                                .name("Duct Tape or 2 Elastic Bungee Cords")
                                .specification("Standard 2-inch wide heavy-duty duct tape or painter's tape to seal perimeter gaps.")
                                .approximateCost("₹50 - ₹80")
                                .isEssential(true)
                                .build(),
                        DiyAirPurifierGuideDTO.MaterialItem.builder()
                                .name("Cardboard Shroud (Pro-Tip)")
                                .specification("Cut a 14-inch diameter circle in cardboard and tape to front of fan. Reduces vortex backflow by 15%.")
                                .approximateCost("₹0 (Recycled cardboard)")
                                .isEssential(false)
                                .build()
                ))
                .steps(List.of(
                        DiyAirPurifierGuideDTO.AssemblyStep.builder()
                                .stepNumber(1)
                                .title("Identify Airflow Direction")
                                .instructions("Examine the perimeter frame of the MERV-13 filter to find the printed arrow showing airflow direction.")
                                .tip("Air always flows into the back of the fan and blows out the front.")
                                .build(),
                        DiyAirPurifierGuideDTO.AssemblyStep.builder()
                                .stepNumber(2)
                                .title("Position Filter on Fan Intake")
                                .instructions("Place the filter flat against the BACK (intake grill) of the box fan. Ensure the printed arrow points TOWARDS the fan motor.")
                                .tip("Having the filter on the back pulls air through the filter before touching fan blades, keeping the motor clean.")
                                .build(),
                        DiyAirPurifierGuideDTO.AssemblyStep.builder()
                                .stepNumber(3)
                                .title("Seal the Perimeter Edges")
                                .instructions("Tightly tape all four perimeter edges with duct tape so no unfiltered air can slip around the sides.")
                                .tip("Press tape firmly into corners for an airtight seal.")
                                .build(),
                        DiyAirPurifierGuideDTO.AssemblyStep.builder()
                                .stepNumber(4)
                                .title("Add Cardboard Shroud to Front (Optional)")
                                .instructions("Tape a cardboard cutout with a 14-inch center hole over the front face of the fan to concentrate outward airflow.")
                                .tip("This prevents aerodynamic backflow at blade tips and lowers motor resistance.")
                                .build(),
                        DiyAirPurifierGuideDTO.AssemblyStep.builder()
                                .stepNumber(5)
                                .title("Deploy and Operate Safely")
                                .instructions("Elevate the unit on a table or chair away from drapes. Run on Medium speed (Speed 2) for optimal noise-to-filtration ratio.")
                                .tip("Do not leave running unattended overnight or when away from home.")
                                .build()
                ))
                .safetyPrecautions(List.of(
                        "Always use box fans with UL/ETL certification and built-in thermal safety fuses.",
                        "Check motor housing temperature with your palm after 30 minutes; it should be warm, not hot.",
                        "Do not use damaged, humming, or vibrating fans.",
                        "Replace the MERV-13 filter when the pleats turn dark grey/brown (typically every 2-3 months during winter smog).",
                        "Keep cords clear of walkways to prevent tripping hazards."
                ))
                .build();
    }

    private IndoorAssessmentResponse mapToResponse(IndoorAssessment assessment) {
        List<IndoorRecommendationDTO> recommendations = generateRecommendations(assessment);
        int hazardScore = calculateHazardScore(assessment);
        String riskLevel = determineRiskLevel(hazardScore);

        return IndoorAssessmentResponse.builder()
                .id(assessment.getId())
                .userId(assessment.getUser() != null ? assessment.getUser().getId() : null)
                .roomCount(assessment.getRoomCount())
                .windowCount(assessment.getWindowCount())
                .floorNumber(assessment.getFloorNumber())
                .totalFloors(assessment.getTotalFloors())
                .hasAirPurifier(assessment.getHasAirPurifier())
                .hasExhaustFan(assessment.getHasExhaustFan())
                .hasChimney(assessment.getHasChimney())
                .cookingFuel(assessment.getCookingFuel())
                .usesIncense(assessment.getUsesIncense())
                .usesMosquitoCoil(assessment.getUsesMosquitoCoil())
                .hasSmokingMember(assessment.getHasSmokingMember())
                .budgetRupees(assessment.getBudgetRupees())
                .hasChildren(assessment.getHasChildren())
                .hasSeniors(assessment.getHasSeniors())
                .additionalNotes(assessment.getAdditionalNotes())
                .createdAt(assessment.getCreatedAt())
                .recommendations(recommendations)
                .estimatedIndoorAqiScore(hazardScore)
                .riskLevel(riskLevel)
                .build();
    }

    private List<IndoorRecommendationDTO> generateRecommendations(IndoorAssessment assessment) {
        List<IndoorRecommendationDTO> recs = new ArrayList<>();

        // 1. Incense / Agarbatti
        if (Boolean.TRUE.equals(assessment.getUsesIncense())) {
            recs.add(IndoorRecommendationDTO.builder()
                    .id(UUID.randomUUID().toString())
                    .category("SOURCE_CONTROL")
                    .title("Discontinue Traditional Agarbatti & Dhoop Indoors")
                    .recommendation("Burning one incense stick emits fine particulate matter (PM2.5) equivalent to 3–5 cigarettes, plus volatile benzene and formaldehyde. Switch to liquid electric diffusers or flower garlands.")
                    .priority("CRITICAL")
                    .estimatedCost("₹0 (Free)")
                    .source("CPCB Domestic Emissions Protocol & Lancet Planetary Health")
                    .impactDescription("Eliminates up to 60 µg/m³ of acute indoor particulate generation during morning pooja.")
                    .actionSteps(List.of(
                            "Cease combustible incense and dhoop sticks inside enclosed living areas",
                            "Use flameless electric LED diyas and fresh flowers for worship rituals",
                            "If traditional incense must be lit, place strictly outdoors on balcony with windows closed"
                    ))
                    .build());
        }

        // 2. Mosquito Coils
        if (Boolean.TRUE.equals(assessment.getUsesMosquitoCoil())) {
            recs.add(IndoorRecommendationDTO.builder()
                    .id(UUID.randomUUID().toString())
                    .category("SOURCE_CONTROL")
                    .title("Replace Chemical Mosquito Coils Immediately")
                    .recommendation("One burning mosquito coil releases as much toxic PM2.5 as 75–137 cigarettes, according to WHO and Chest Research Foundation studies. Install window mesh or switch to electric liquid vaporizers.")
                    .priority("CRITICAL")
                    .estimatedCost("₹150 - ₹400")
                    .source("Chest Research Foundation & WHO Indoor Air Guidelines")
                    .impactDescription("Protects lungs from toxic pyrethroid smoke and severe particulate inhalation.")
                    .actionSteps(List.of(
                            "Install velcro nylon insect mesh on bedroom windows",
                            "Switch to liquid electric mosquito vaporizers or rechargeable swat bats",
                            "Ensure door gaps are sealed to prevent insect ingress without burning coils"
                    ))
                    .build());
        }

        // 3. Indoor Smoking
        if (Boolean.TRUE.equals(assessment.getHasSmokingMember())) {
            recs.add(IndoorRecommendationDTO.builder()
                    .id(UUID.randomUUID().toString())
                    .category("SOURCE_CONTROL")
                    .title("Enforce 100% Smoke-Free Home Protocol")
                    .recommendation("Second-hand and third-hand tobacco smoke particles embed deep in sofa fabrics, curtains, and mattresses, off-gassing carcinogenic VOCs for weeks. Maintain zero smoking inside.")
                    .priority("CRITICAL")
                    .estimatedCost("₹0 (Free)")
                    .source("WHO Environmental Tobacco Smoke Guidelines")
                    .impactDescription("Prevents asthma flare-ups and chronic respiratory irritation in children and seniors.")
                    .actionSteps(List.of(
                            "Designate smoking strictly outdoors away from windows and entrance doors",
                            "Launder upholstery, curtains, and linens exposed to tobacco smoke",
                            "Keep children and elderly bedrooms completely smoke-free zones"
                    ))
                    .build());
        }

        // 4. Cooking Fuel: Biomass vs LPG vs Electric
        if ("BIOMASS".equalsIgnoreCase(assessment.getCookingFuel())) {
            recs.add(IndoorRecommendationDTO.builder()
                    .id(UUID.randomUUID().toString())
                    .category("SOURCE_CONTROL")
                    .title("Urgent Biomass/Chulha Cooking Fuel Transition")
                    .recommendation("Solid biomass combustion generates fatal levels of carbon monoxide (CO) and ultrafine black carbon, exceeding WHO thresholds by up to 30x. Transition to LPG or electric induction immediately.")
                    .priority("CRITICAL")
                    .estimatedCost("₹1,200 - ₹2,500")
                    .source("Pradhan Mantri Ujjwala Yojana (PMUY) & ICMR Health Advisory")
                    .impactDescription("Drastically reduces chronic lung disease risks for the primary cook and family.")
                    .actionSteps(List.of(
                            "Apply for subsidised PMUY LPG connection at nearest gas agency",
                            "Install a portable single-burner induction cooktop (1200W-1600W)",
                            "Never operate wood, dung, or charcoal chulha inside an unvented kitchen"
                    ))
                    .build());
        }

        // 5. Kitchen Ventilation: Exhaust / Chimney
        if (!Boolean.TRUE.equals(assessment.getHasChimney()) && !Boolean.TRUE.equals(assessment.getHasExhaustFan())) {
            recs.add(IndoorRecommendationDTO.builder()
                    .id(UUID.randomUUID().toString())
                    .category("VENTILATION")
                    .title("Install High-CFM Kitchen Exhaust Fan")
                    .recommendation("Indian cooking (tadka, frying, spices) produces rapid indoor PM2.5 spikes up to 800 µg/m³. Without mechanical exhaust, oil aerosols disperse into bedrooms and living areas.")
                    .priority("HIGH")
                    .estimatedCost("₹850 - ₹1,500")
                    .source("CPCB Domestic Air Quality Guidelines")
                    .impactDescription("Evacuates 70% of cooking grease, nitrogen dioxide, and ultrafine aerosols at source.")
                    .actionSteps(List.of(
                            "Install a minimum 200mm (8-inch) high-velocity kitchen exhaust fan",
                            "Keep kitchen door closed while cooking so smoke does not migrate to bedrooms",
                            "Crack kitchen window slightly to provide makeup airflow for the exhaust"
                    ))
                    .build());
        } else {
            recs.add(IndoorRecommendationDTO.builder()
                    .id(UUID.randomUUID().toString())
                    .category("VENTILATION")
                    .title("Run Exhaust Fan for 15 Minutes Post-Cooking")
                    .recommendation("Ultrafine cooking particles and nitrogen dioxide linger suspended in room air for 20-30 minutes after burners are turned off. Keep the exhaust operating for 15 minutes post-cooking.")
                    .priority("MEDIUM")
                    .estimatedCost("₹0 (Free)")
                    .source("US EPA Indoor Air Quality in Residential Kitchens")
                    .impactDescription("Flushes residual NO2 and volatile organic compounds from stove combustion.")
                    .actionSteps(List.of(
                            "Turn on chimney/exhaust 2 minutes before igniting burners",
                            "Leave running on medium speed for 15 minutes after cooking completes",
                            "Clean baffle filters or exhaust blades monthly with warm detergent water"
                    ))
                    .build());
        }

        // 6. Midday Ventilation Window (Inversion Rule)
        recs.add(IndoorRecommendationDTO.builder()
                .id(UUID.randomUUID().toString())
                .category("VENTILATION")
                .title("Window Timing: Ventilate Exclusively Between 12 PM - 4 PM")
                .recommendation("Winter temperature inversion traps ground-level pollution under cold air between 6:00 AM – 10:00 AM and after sunset. Only air out the house around 1:00 PM – 3:30 PM when solar warming dilutes smog.")
                .priority("HIGH")
                .estimatedCost("₹0 (Free)")
                .source("India Meteorological Department (IMD) Boundary Layer Research")
                .impactDescription("Prevents heavy outdoor winter smog from rushing inside during morning sweeps.")
                .actionSteps(List.of(
                        "Keep all windows, ventilators, and balcony glass doors tightly shut from 6 AM to 10 AM",
                        "Open windows for cross-ventilation for 20-30 minutes between 1:00 PM and 3:30 PM",
                        "Close and latch all windows by 5:00 PM as temperature inversion re-forms"
                ))
                .build());

        // 7. Air Purifier & Filtration Strategy
        if (!Boolean.TRUE.equals(assessment.getHasAirPurifier())) {
            int budget = assessment.getBudgetRupees() != null ? assessment.getBudgetRupees() : 0;
            if (budget >= 5000) {
                recs.add(IndoorRecommendationDTO.builder()
                        .id(UUID.randomUUID().toString())
                        .category("FILTRATION")
                        .title("Purchase True HEPA (H13) Air Purifier for Master Bedroom")
                        .recommendation("For your budget, select a True HEPA (H13) air purifier with CADR >= 250 m³/h. Avoid units with uncertified ionizers that emit harmful ozone gas.")
                        .priority("HIGH")
                        .estimatedCost("₹5,500 - ₹8,500")
                        .source("AHAM CADR Standard & CPCB Air Purifier Guidance")
                        .impactDescription("Removes 99.97% of fine particles PM2.5 in a 200 sq ft bedroom in 15 minutes.")
                        .actionSteps(List.of(
                                "Choose models featuring True HEPA H13 + activated carbon layer",
                                "Verify CADR rating is at least 200–280 m³/h for your room dimensions",
                                "Place unit 1-2 feet away from walls in the designated Clean Air Room"
                        ))
                        .build());
            } else {
                recs.add(IndoorRecommendationDTO.builder()
                        .id(UUID.randomUUID().toString())
                        .category("FILTRATION")
                        .title("Assemble Low-Cost DIY Box Fan Air Filter (EPA Style)")
                        .recommendation("With zero or modest budget, a standard 20-inch box fan taped to a MERV-13 pleated filter removes up to 75-80% of fine particles at a fraction of commercial costs.")
                        .priority("HIGH")
                        .estimatedCost("₹900 - ₹1,400")
                        .source("US EPA Science Report on Low-Cost Filtration (EPA/600/R-21/104)")
                        .impactDescription("Delivers clean air equivalent to ₹7,000+ commercial units for under ₹1,400.")
                        .actionSteps(List.of(
                                "Check our interactive step-by-step DIY Air Purifier guide in the DIY tab",
                                "Fasten a 20x20 MERV-13 filter to the intake side using duct tape",
                                "Operate in the Clean Air Room on Medium speed"
                        ))
                        .build());
            }
        } else {
            recs.add(IndoorRecommendationDTO.builder()
                    .id(UUID.randomUUID().toString())
                    .category("FILTRATION")
                    .title("Maximize Air Purifier Efficiency & Filter Longevity")
                    .recommendation("Ensure purifier has 360-degree clearance. Vacuum the mesh pre-filter every 2 weeks to prevent dust buildup from choking the delicate HEPA layer.")
                    .priority("MEDIUM")
                    .estimatedCost("₹0 (Free)")
                    .source("AHAM Air Cleaner Operational Best Practices")
                    .impactDescription("Maintains peak CADR clean air output and doubles HEPA filter replacement lifespan.")
                    .actionSteps(List.of(
                            "Position purifier 1-2 feet off walls, away from curtains and corners",
                            "Keep bedroom doors and windows closed while running the purifier",
                            "Vacuum or wash outer pre-filter every 14 days"
                    ))
                    .build());
        }

        // 8. Designate Clean Air Room
        recs.add(IndoorRecommendationDTO.builder()
                .id(UUID.randomUUID().toString())
                .category("HABIT")
                .title("Designate Bedroom as Family Clean Air Sanctuary")
                .recommendation("Concentrate protection where family members sleep and spend 8+ hours breathing. Place a rolled damp towel or draft-stopper under the door gap to seal out hallway pollutants.")
                .priority("HIGH")
                .estimatedCost("₹0 - ₹200")
                .source("US EPA Clean Air Room Guidance")
                .impactDescription("Creates an indoor zone with up to 80% lower PM2.5 during severe smog spikes.")
                .actionSteps(List.of(
                        "Pick the interior bedroom with fewest exterior windows",
                        "Seal bottom door gap using a door sweep or rolled damp towel",
                        "Run filtration in this room and gather vulnerable members during peak smog"
                ))
                .build());

        // 9. Cleaning: Wet Mopping (Pocha) vs Dry Sweeping (Jhadu)
        recs.add(IndoorRecommendationDTO.builder()
                .id(UUID.randomUUID().toString())
                .category("CLEANING")
                .title("Replace Dry Brooms with Damp Microfiber Mopping (Pocha)")
                .recommendation("Dry sweeping with traditional grass brooms (jhadu) resuspends settled toxic PM10 and heavy metal dust back into the breathing zone for up to 3 hours. Always damp mop.")
                .priority("MEDIUM")
                .estimatedCost("₹0 (Free)")
                .source("WHO Environmental Health Criteria (Dust Resuspension)")
                .impactDescription("Stops dangerous resuspension of settled road dust and fine particulates.")
                .actionSteps(List.of(
                        "Use damp microfiber mop with plain water daily",
                        "Wipe table surfaces and shelves with damp cloths instead of feather dusters",
                        "Keep shoe racks outside the main entrance door"
                ))
                .build());

        return recs;
    }

    private int calculateHazardScore(IndoorAssessment a) {
        int score = 20; // baseline

        if ("BIOMASS".equalsIgnoreCase(a.getCookingFuel())) score += 35;
        if (Boolean.TRUE.equals(a.getUsesMosquitoCoil())) score += 25;
        if (Boolean.TRUE.equals(a.getHasSmokingMember())) score += 25;
        if (Boolean.TRUE.equals(a.getUsesIncense())) score += 15;
        if (!Boolean.TRUE.equals(a.getHasChimney()) && !Boolean.TRUE.equals(a.getHasExhaustFan())) score += 15;
        if (Boolean.TRUE.equals(a.getHasChildren()) || Boolean.TRUE.equals(a.getHasSeniors())) score += 10;
        if (Boolean.TRUE.equals(a.getHasAirPurifier())) score -= 30;

        return Math.max(10, Math.min(100, score));
    }

    private String determineRiskLevel(int score) {
        if (score >= 70) return "CRITICAL";
        if (score >= 45) return "HIGH";
        if (score >= 25) return "MODERATE";
        return "LOW";
    }

    private IndoorAssessment createDefaultAssessment(User user) {
        return IndoorAssessment.builder()
                .user(user)
                .roomCount(2)
                .windowCount(4)
                .floorNumber(1)
                .totalFloors(4)
                .hasAirPurifier(false)
                .hasExhaustFan(true)
                .hasChimney(false)
                .cookingFuel("LPG")
                .usesIncense(false)
                .usesMosquitoCoil(false)
                .hasSmokingMember(false)
                .budgetRupees(1000)
                .hasChildren(false)
                .hasSeniors(false)
                .additionalNotes("Default profile")
                .build();
    }

    private IndoorAssessmentResponse createDefaultAssessmentResponse() {
        IndoorAssessment def = createDefaultAssessment(null);
        return mapToResponse(def);
    }
}
