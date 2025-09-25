module.exports = {
    name: 'EdDungeons',
    description: 'API to access EdDungeons features including zones, currencies, enchantments, GUI systems, booster management, leveling systems, and advanced entity management with fake entities, custom 3D models, and goal-based AI behavior',
    pluginId: 'EdDungeons',
    systemDownloadURL: `
        https://raw.githubusercontent.com/CodellaAI/codella-documentations/main/lib/EdDungeons-API.jar
        https://raw.githubusercontent.com/CodellaAI/codella-documentations/main/lib/EdLib-API.jar
    `,
    mavenIntegration: `
        <repositories>
            // SYSTEM DEPENDENCY NO REPOSITORY
        </repositories>
        <dependencies>
            <!-- EdDungeons main API -->
            <dependency>
                <groupId>es.edwardbelt.eddungeons</groupId>
                <artifactId>api</artifactId>
                <version>1.2</version>
                <scope>system</scope>
                <systemPath>${basedir}/lib/EdDungeons-API.jar</systemPath>
            </dependency>
            
            <!-- EdLib low-level API -->
            <dependency>
                <groupId>es.edwardbelt.edlib</groupId>
                <artifactId>api</artifactId>
                <version>1.0</version>
                <scope>system</scope>
                <systemPath>${basedir}/lib/EdLib-API.jar</systemPath>
            </dependency>
        </dependencies>
    `,
    usage: `
        /**
         * EdDungeons API Overview
         * The EdDungeons API consists of two main system dependencies:
         * 
         * EdLib-API.jar:
         * - Low-level server functionality and utilities
         * - Fake entity management and manipulation
         * - Packet handling and NMS abstraction
         * - Cross-version compatibility layers
         * - Performance-optimized server operations
         * 
         * EdDungeons-API.jar:
         * - High-level EdDungeons plugin integration
         * - Zone management and manipulation
         * - Booster system integration
         * - GUI framework and management
         * - Mob configuration and behavior
         * - Currency and leveling system access
         */
         
         Inside the plugin.yml you should only add EdDungeons plugin as a depend, the EdLib API is inside the main EdDungeons jar.
        
        // MAIN PACKAGES WITH IT CLASSES:
        // EdDungeons API: es.edwardbelt.eddungeons.iapi: APIPair, EdDungeonsAPI, EdDungeonsBoostersAPI, EdDungeonsCurrencyAPI, EdDungeonsEnchantAPI, EdDungeonsGuisAPI, EdDungeonsLevelingAPI, EdDungeonsSwordAPI, EdDungeonsZonesAPI
        // EdDungeons Events: es.edwardbelt.eddungeons.iapi.event: EdDungeonsCurrencyAddEvent, EdDungeonsCurrencyRemoveEvent, EdDungeonsEnchantTryProcEvent, EdDungeonsJoinZoneEvent
        // EdDungeons Enchants: es.edwardbelt.eddungeons.iapi.enchant: APIEnchant, CustomEnchantData, EnchantData
        // EdLib API: es.edwardbelt.edlib.iapi: EdColor, EdLibAPI
        // EdLib Entities: es.edwardbelt.edlib.iapi.entity: EdEntity, EdEntityVariantable, EdFallingBlock, EdLivingEntity, EdPrimedTNT, EntityAnimation, EntityEquipmentSlot, EntityHolder, EntityVariant
        // EdLib Goals: es.edwardbelt.edlib.iapi.entity.goal contains EdGoal class
        // EdLib Goals Impl: es.edwardbelt.edlib.iapi.entity.goal.impl contains all goal implementations
        // EdLib Models: es.edwardbelt.edlib.iapi.model: EdModel, EdModelEntity
        
        // Singleton Access Pattern
        EdDungeonsAPI api = EdDungeonsAPI.getInstance();
        
        // Access specific subsystem APIs
        EdDungeonsCurrencyAPI currencyAPI = api.getCurrencyAPI();
        EdDungeonsZonesAPI zonesAPI = api.getZonesAPI();
        EdDungeonsEnchantAPI enchantAPI = api.getEnchantAPI();
        EdDungeonsGuisAPI guisAPI = api.getGuisAPI();
        EdDungeonsSwordAPI swordAPI = api.getSwordAPI();
        EdDungeonsLevelingAPI levelingAPI = api.getLevelingAPI();
        EdDungeonsBoostersAPI boostersAPI = api.getBoostersAPI();
        
        // EdLib API Access
        EdLibAPI edLibAPI = EdLibAPI.getInstance();
        
        // ===== CURRENCY SYSTEM =====
        // The currency system supports multiple custom currencies with BigDecimal precision
        
        // Balance Operations
        BigDecimal balance = currencyAPI.getCurrency(playerUUID, "money");
        currencyAPI.setCurrency(playerUUID, "money", new BigDecimal("1000"));
        currencyAPI.addCurrency(playerUUID, "money", new BigDecimal("500"));
        currencyAPI.removeCurrency(playerUUID, "money", new BigDecimal("250"));
        
        // Currency Configuration
        double maxValue = currencyAPI.getMaxCurrencyValue("money");
        double startingValue = currencyAPI.getStartingCurrencyValue("money");
        String displayName = currencyAPI.getCurrencyName("money");
        
        // Example: Shop Transaction (with async scheduler)
        Bukkit.getScheduler().runTaskAsynchronously(plugin, () -> {
            BigDecimal itemCost = new BigDecimal("100");
            BigDecimal playerBalance = currencyAPI.getCurrency(playerUUID, "money");
            if (playerBalance.compareTo(itemCost) >= 0) {
                currencyAPI.removeCurrency(playerUUID, "money", itemCost);
                player.sendMessage("§aPurchase successful!");
            } else {
                player.sendMessage("§cInsufficient funds!");
            }
        });
        
        // ===== ZONES SYSTEM =====
        // Zone management for dungeon progression and mob encounters
        
        // Session Management
        zonesAPI.joinSession(player, "forest-zone");
        zonesAPI.leaveSession(player);
        boolean inSession = zonesAPI.isPlayerInSession(player);
        String currentZone = zonesAPI.getPlayerZoneId(player);
        
        // Stage Progression
        zonesAPI.setPlayerZoneStageId(player, "forest-zone", "stage-2");
        String currentStage = zonesAPI.getPlayerZoneStageId(player, "forest-zone");
        
        // Mob Interaction
        Set<Integer> zoneMobs = zonesAPI.getPlayerMobsInZone(player);
        zonesAPI.hitMob(player, mobId, BigDecimal damage, boolean giveSwingCurrencies, boolean triggerEnchants); // generally giveSwingCurrencies and triggerEnchants should be false
        zonesAPI.startAutoHitMob(player, mobId);
        EdEntity mob = zonesAPI.getMobEntity(player, mobId);
        
        // ===== ENCHANTMENT SYSTEM =====
        // Custom enchantments with level progression and activation chances
        
        // Player Enchantment Management
        enchantAPI.addEnchantLevel(playerUUID, "fire_sword", 1.0);
        double enchantLevel = enchantAPI.getEnchantLevel(playerUUID, "fire_sword");
        enchantAPI.removeEnchantLevel(playerUUID, "fire_sword", 0.5);
        
        // Chance Calculation
        double activationChance = enchantAPI.getEnchantChance(playerUUID, "fire_sword");
        
        // Manual Activation
        enchantAPI.triggerCustomEnchant(player, "fire_sword", mobId);
        boolean activated = enchantAPI.tryTriggerCustomEnchant(player, "fire_sword", mobId);
        
        // Enchantment Configuration
        double maxLevel = enchantAPI.getEnchantMaxLevel("fire_sword");
        double startingLevel = enchantAPI.getEnchantStartingLevel("fire_sword");
        double maxChance = enchantAPI.getEnchantMaxChance("fire_sword");
        
        // Custom Enchantment Registration
        The enchants are usually only for 1 player so if you spawn particles only spawn them to the player, same for mobs only add the mob watcher to the player
        public class FireSwordEnchant implements APIEnchant {
            @Override
            public void onProc(Player player, EnchantData data) {
                if (data instanceof CustomEnchantData) {
                    CustomEnchantData customData = (CustomEnchantData) data;
                    player.sendMessage("§cFire Sword activated on mob " + customData.getMobId());
                    // Apply fire effect to mob
                }
            }
        }
        
        // Register custom enchantment
        enchantAPI.registerEnchant("fire_sword", new FireSwordEnchant());
        
        // ===== GUI SYSTEM =====
        // Dynamic GUI management with placeholder support
        
        // Basic GUI Operations
        guisAPI.openGui(player, "main_menu");
        
        // GUI with Custom Data
        Map<String, String> placeholders = new HashMap<>();
        placeholders.put("player_name", player.getName());
        placeholders.put("player_balance", balance.toString());
        placeholders.put("current_zone", currentZone);
        guisAPI.openGui(player, "player_stats", placeholders);
        
        // Close GUI
        guisAPI.closeGui(player);
        
        // Dynamic GUI Loading
        guisAPI.loadGui("custom_menu", new File("guis/custom_menu.yml"));
        
        // ===== SWORD SYSTEM =====
        // Player weapon progression and validation
        
        // Sword Item Management
        ItemStack playerSword = swordAPI.getSwordItemFromPlayer(player);
        boolean isSword = swordAPI.isItemSword(heldItem);
        
        // Update player's sword
        if (playerSword != null) {
            player.getInventory().setItemInMainHand(playerSword);
            player.sendMessage("§aSword updated!");
        }
        
        // ===== LEVELING SYSTEM =====
        // Multiple independent progression tracks
        
        // Level Management
        levelingAPI.setLevel(playerUUID, "sword_mastery", 10.5);
        double currentLevel = levelingAPI.getLevel(playerUUID, "sword_mastery");
        levelingAPI.addLevel(playerUUID, "sword_mastery", 1.0);
        levelingAPI.removeLevel(playerUUID, "sword_mastery", 0.5);
        
        // Level Configuration
        boolean isValidLevel = levelingAPI.isLevel("sword_mastery");
        double startingLevel = levelingAPI.getStartingLevel("sword_mastery");
        boolean isAutomatic = levelingAPI.isAutomaticLeveling("sword_mastery");
        String levelName = levelingAPI.getLevelName("sword_mastery");
        
        // Reward System
        List<String> forEachRewards = levelingAPI.getForEachRewards("sword_mastery");
        Map<Double, List<String>> intervalRewards = levelingAPI.getIntervalRewards("sword_mastery");
        Map<Double, List<String>> specificRewards = levelingAPI.getSpecificRewards("sword_mastery");
        
        // ===== BOOSTER SYSTEM =====
        // Temporary multipliers for various game aspects
        
        // Booster Value Retrieval
        double moneyBoost = boostersAPI.getBoosterValueByEconomy(playerUUID, "money");
        double enchantBoost = boostersAPI.getBoosterValueGlobalEnchants(playerUUID);
        
        // Active Booster Management
        List<String> activeBoosters = boostersAPI.getActiveBoosters(playerUUID);
        boostersAPI.removeBooster(playerUUID, "event_boost_123");
        
        // Booster Properties
        boolean exists = boostersAPI.existsBooster(playerUUID, "money_boost");
        boolean isEnchantType = boostersAPI.isBoosterEnchantType(playerUUID, "money_boost");
        String boosterCurrency = boostersAPI.getBoosterCurrency(playerUUID, "money_boost");
        String boosterName = boostersAPI.getBoosterName(playerUUID, "money_boost");
        double multiplier = boostersAPI.getBoosterMultiplier(playerUUID, "money_boost");
        
        // Timing Information
        long duration = boostersAPI.getBoosterDuration(playerUUID, "money_boost");
        long remaining = boostersAPI.getBoosterRemainingTime(playerUUID, "money_boost");
        
        // Booster Modification
        boostersAPI.setBoosterMultiplier(playerUUID, "money_boost", 2.5);
        boostersAPI.setBoosterDuration(playerUUID, "money_boost", 3600000L);
        boostersAPI.setBoosterTimeLeft(playerUUID, "money_boost", 1800000L);
        
        // Create New Booster
        boostersAPI.addBooster(
            playerUUID,
            "event_money_boost_" + System.currentTimeMillis(),
            "§6Event Money Boost",
            "money",
            2.0, // 2x multiplier
            3600000L, // 1 hour
            false, // Not enchant booster
            true // Save to database
        );
        
        // ===== EDLIB ENTITY SYSTEM =====
        // Advanced fake entity management and manipulation
        
        // Basic Entity Creation
        EdEntity zombie = edLibAPI.createEntity(EntityType.ZOMBIE, location);
        zombie.setDisplayName("§cGuard Zombie");
        zombie.setGlowing(EdColor.RED);
        zombie.addWatcher(player);
        zombie.spawn();
        
        // Interaction Entity (Invisible Click Zones)
        EdEntity clickZone = edLibAPI.createInteractionEntity(location, 2.0f, 2.0f);
        clickZone.addWatcher(player);
        clickZone.spawn();
        
        // Block Display Entity
        Matrix4f matrix = new Matrix4f().identity();
        EdEntity blockDisplay = edLibAPI.createBlockDisplay(location, matrix, Material.DIAMOND_BLOCK);
        
        // Item Display Entity
        EdEntity itemDisplay = edLibAPI.createItemDisplay(location, matrix, textureString, uuidArray, "Custom Item");
        
        // Entity Properties and Behavior
        zombie.setEquipment(EntityEquipmentSlot.MAIN_HAND, new ItemStack(Material.DIAMOND_SWORD));
        zombie.setEquipment(EntityEquipmentSlot.HELMET, new ItemStack(Material.DIAMOND_HELMET));
        zombie.playAnimation(EntityAnimation.SWING_MAIN_HAND);
        zombie.setGravity(false);
        zombie.setInvisible();
        
        // Entity Movement and Positioning
        zombie.tp(10, 64, 10); // It must always be 3 doubles, you can't put a Location
        zombie.rotateBodyAndMove(15, 64, 15, 90f, 0f);
        zombie.setYawHead(45f);
        Vector currentPos = zombie.getPosition();
        
        // Entity Variants (for supported entities)
        if (entity instanceof EdEntityVariantable) {
            EdEntityVariantable variantEntity = (EdEntityVariantable) entity;
            variantEntity.setVariant(EntityVariant.Wolf.BLACK);
        }
        
        // Entity Falling Block
        if (entity instanceof EdFallingBlock) {
            EdEntityFallingBlock fallingBlock = (EdEntityFallingBlock) entity;
            fallingBlock.setFallingBlock(Material.DIAMOND_BLOCK);
        }
        
        // Entity Primed TNT
        if (entity instanceof EdPrimedTNT) {
            EdPrimedTNT primedTNT = (EdPrimedTNT) entity;
            primedTNT.setFuseTicks(20L);
            primedTNT.setMaterial(Material.COAL_BLOCK);
        }
        
        If you want to move the entity smoothly or you are moving the entity less than 8 blocks use this methods to move the mob:
        entity.shortTp(double x, double y, double z);
        entity.rotateBodyAndMove(double x, double y, double z, float yaw, float pitch);
        entity.rotateBody(float yaw, float pitch);
        entity.rotateHead(float yaw);
        
        // ===== GOAL SYSTEM (AI BEHAVIOR) =====
        // Queue-based AI behavior for entities
        
        // Basic Movement Goals
        zombie.addGoal(new EdGoalMove(new Vector(10, 64, 10), 0.2));
        zombie.addGoal(new EdGoalDelay(60)); // Wait 3 seconds
        zombie.addGoal(new EdGoalMove(new Vector(0, 64, 0), 0.2));
        
        // Advanced Movement Goals
        EdGoalOrbit orbitGoal = new EdGoalOrbit(centerPoint, 5.0, 0.05, true, 200);
        orbitGoal.setAffectY(false);
        zombie.addGoal(orbitGoal);
        
        // Follow Entity Goal
        EntityHolder playerHolder = new EntityHolder(player);
        zombie.addGoal(new EdGoalFollowEntity(playerHolder, 3.0, 0.15, 30));
        
        // Parabolic Movement (Jumping)
        zombie.addGoal(new EdGoalParabolicMove(new Vector(10, 64, 10), 3.0, 2000));
        
        // Custom Goal Implementation
        public class CustomPatrolGoal extends EdGoal {
            private final Vector[] waypoints;
            private int currentWaypoint = 0;
            private boolean completed = false;
            
            @Override
            public void start() {
                getEntity().setDisplayName("§ePatrolling...");
            }
            
            @Override
            public boolean shouldExecute() {
                return !completed;
            }
            
            @Override
            public void tick() {
                Vector target = waypoints[currentWaypoint];
                Vector current = getEntity().getPosition();
                
                if (current.distance(target) < 1.0) {
                    currentWaypoint++;
                    if (currentWaypoint >= waypoints.length) {
                        completed = true;
                    }
                }
            }
        }
        
        // Goal Queue Management
        zombie.clearGoals();
        zombie.skipCurrentGoal();
        EdGoal currentGoal = zombie.getCurrentGoal();
        Queue<EdGoal> goalQueue = zombie.getGoalQueue();
        
        // ===== 3D MODEL SYSTEM =====
        // Custom 3D model support with BDEngine integration
        
        // Model Management
        EdModel dragonModel = edLibAPI.getModel("dragon");
        if (dragonModel != null) {
            EdModelEntity dragon = dragonModel.createEntity(location);
            dragon.addWatcher(player);
            dragon.spawn();
            
            // Model Positioning
            dragon.rotate(180f, -30f);
            dragon.setYaw(90f);
            
            // Animation Control
            dragon.playAnimation("roar");
            dragon.playLoopAnimation("idle_breathing");
            dragon.stopAnimation();
            
            // Component Access
            EdEntity mainBody = dragon.getMainEntity();
            EdEntity nameTag = dragon.getDisplayName();
            EdEntity interaction = dragon.getInteractionEntity();
            Map<String, EdEntity> parts = dragon.getPassengers();
            
            // Visual Effects
            dragon.setGlowing(EdColor.PURPLE);
        }
        
        // ===== PLAYER INTERFACE ELEMENTS =====
        // Boss bars, action bars, and UI components
        
        // Action Bar Messages
        edLibAPI.sendActionbar(player, "§6Mining in progress...");
        
        // Experience Bar as Progress Indicator
        edLibAPI.sendXPBar(player, 0.75f, 15); // 75% filled, level 15
        
        // Boss Bar Management
        UUID bossBarId = UUID.randomUUID();
        edLibAPI.sendBossBar(player, bossBarId, "§cDragon Health", 0.8f, "red");
        edLibAPI.updateBossBarProgress(player, bossBarId, 0.5f);
        edLibAPI.updateBossBarTitle(player, bossBarId, "§cDragon - 50% Health");
        edLibAPI.removeBossBar(player, bossBarId);
        
        // Player Visibility Control
        edLibAPI.hidePlayer(viewer, target);
        edLibAPI.showPlayer(viewer, target);
        
        // Fake Block Changes (Player-Specific)
        Map<Vector, Material> fakeBlocks = new HashMap<>();
        fakeBlocks.put(new Vector(0, 64, 0), Material.DIAMOND_BLOCK);
        fakeBlocks.put(new Vector(1, 64, 0), Material.GOLD_BLOCK);
        edLibAPI.sendBlocks(player, fakeBlocks);
        
        // ===== EVENT SYSTEM =====
        // Comprehensive event handling for EdDungeons
        
        // Currency Events
        @EventHandler
        public void onCurrencyAdd(EdDungeonsCurrencyAddEvent event) {
            UUID player = event.getUuid();
            String currency = event.getCurrency();
            BigDecimal amount = event.getAmount();
            double multiplier = event.getMultiplier();
            
            // Add bonus multiplier for VIP players
            if (isVIP(player)) {
                event.addMultiplier(0.5); // +50% bonus
            }
        }
        
        // Enchantment Events
        @EventHandler
        public void onEnchantProc(EdDungeonsEnchantTryProcEvent event) {
            Player player = event.getPlayer();
            String enchant = event.getEnchant();
            double chance = event.getChance();
            
            // Increase chance during special events
            if (isSpecialEvent()) {
                event.setChance(Math.min(1.0, chance * 1.5));
            }
        }
        
        // Combat Events
        @EventHandler
        public void onSwordSwing(EdDungeonsSwingSwordEvent event) {
            Player player = event.getPlayer();
            int entityId = event.getEntityId();
            int damage = event.getDamageDealt();
            
            player.sendMessage("§6Dealt " + damage + " damage!");
        }
        
        // Zone Events
        @EventHandler
        public void onZoneJoin(EdDungeonsJoinZoneEvent event) {
            Player player = event.getPlayer();
            String zoneId = event.getZoneId();
            
            player.sendMessage("§aWelcome to " + zoneId + "!");
        }
        
        // ===== UTILITY CLASSES =====
        
        // EntityHolder - Unified entity reference
        EntityHolder bukkitHolder = new EntityHolder(bukkitEntity);
        EntityHolder edHolder = new EntityHolder(edEntity);
        Vector position = holder.getPosition();
        
        // ===== BUKKIT ASYNC SCHEDULER =====
        // IMPORTANT: All API operations should preferably be executed with Bukkit async scheduler
        // to prevent blocking the main thread and ensure optimal performance
        
        Bukkit.getScheduler().runTaskAsynchronously(plugin, () -> {
            // Perform API operations here
            EdDungeonsAPI api = EdDungeonsAPI.getInstance();
            // ... your API calls
        });
        
        // ===== ENTITY ANIMATIONS =====
        // All available entity animations with their IDs
        
        entity.playAnimation(EntityAnimation.SWING_MAIN_HAND);    // ID: 0 - Main hand swing
        entity.playAnimation(EntityAnimation.LEAVE_BED);          // ID: 1 - Leave bed animation  
        entity.playAnimation(EntityAnimation.SWING_OFF_HAND);     // ID: 3 - Off hand swing
        entity.playAnimation(EntityAnimation.CRITICAL_EFFECT);    // ID: 4 - Critical hit effect
        entity.playAnimation(EntityAnimation.MAGIC_CRITICAL_EFFECT); // ID: 5 - Magic critical effect
        
        // ===== ENTITY EQUIPMENT SLOTS =====
        // All available equipment slots with their IDs
        // The equipment must always be set after spawning the mob
        
        entity.setEquipment(EntityEquipmentSlot.MAIN_HAND, sword);      // ID: 0 - Main hand item
        entity.setEquipment(EntityEquipmentSlot.OFF_HAND, shield);      // ID: 1 - Off hand item
        entity.setEquipment(EntityEquipmentSlot.BOOTS, boots);          // ID: 2 - Feet armor
        entity.setEquipment(EntityEquipmentSlot.LEGGINGS, leggings);    // ID: 3 - Leg armor
        entity.setEquipment(EntityEquipmentSlot.CHESTPLATE, chestplate); // ID: 4 - Chest armor
        entity.setEquipment(EntityEquipmentSlot.HELMET, helmet);        // ID: 5 - Head armor
        entity.setEquipment(EntityEquipmentSlot.BODY, bodyArmor);       // ID: 6 - Body decoration
        entity.setEquipment(EntityEquipmentSlot.SADDLE, saddle);        // ID: 7 - Mount saddle
        
        // ===== ENTITY VARIANTS =====
        // Complete list of all entity variants available for different mob types
        
        if (entity instanceof EdEntityVariantable) {
            EdEntityVariantable variantEntity = (EdEntityVariantable) entity;
            
            // AXOLOTL VARIANTS
            variantEntity.setVariant(EntityVariant.Axolotl.BLUE);   // Blue axolotl
            variantEntity.setVariant(EntityVariant.Axolotl.CYAN);   // Cyan axolotl  
            variantEntity.setVariant(EntityVariant.Axolotl.GOLD);   // Gold axolotl
            variantEntity.setVariant(EntityVariant.Axolotl.LUCY);   // Lucy axolotl (leucistic)
            variantEntity.setVariant(EntityVariant.Axolotl.WILD);   // Wild brown axolotl
            
            // CAT VARIANTS
            variantEntity.setVariant(EntityVariant.Cat.WHITE);               // White cat
            variantEntity.setVariant(EntityVariant.Cat.BRITISH_SHORTHAIR);   // British Shorthair
            variantEntity.setVariant(EntityVariant.Cat.JELLIE);              // Jellie cat
            variantEntity.setVariant(EntityVariant.Cat.TUXEDO);              // Tuxedo cat
            variantEntity.setVariant(EntityVariant.Cat.BLACK);               // Black cat
            variantEntity.setVariant(EntityVariant.Cat.TABBY);               // Tabby cat
            variantEntity.setVariant(EntityVariant.Cat.SIAMESE);             // Siamese cat
            variantEntity.setVariant(EntityVariant.Cat.RAGDOLL);             // Ragdoll cat
            variantEntity.setVariant(EntityVariant.Cat.CALICO);              // Calico cat
            variantEntity.setVariant(EntityVariant.Cat.RED);                 // Red/orange cat
            variantEntity.setVariant(EntityVariant.Cat.PERSIAN);             // Persian cat
            
            // CHICKEN VARIANTS
            variantEntity.setVariant(EntityVariant.Chicken.TEMPERATE);  // Temperate climate chicken
            variantEntity.setVariant(EntityVariant.Chicken.COLD);       // Cold climate chicken
            variantEntity.setVariant(EntityVariant.Chicken.WARM);       // Warm climate chicken
            
            // COW VARIANTS  
            variantEntity.setVariant(EntityVariant.Cow.TEMPERATE);  // Temperate climate cow
            variantEntity.setVariant(EntityVariant.Cow.COLD);       // Cold climate cow
            variantEntity.setVariant(EntityVariant.Cow.WARM);       // Warm climate cow
            
            // FROG VARIANTS
            variantEntity.setVariant(EntityVariant.Frog.TEMPERATE);  // Temperate frog
            variantEntity.setVariant(EntityVariant.Frog.COLD);       // Cold climate frog
            variantEntity.setVariant(EntityVariant.Frog.WARM);       // Warm climate frog
            
            // MOOSHROOM VARIANTS
            variantEntity.setVariant(EntityVariant.Mooshroom.BROWN);  // Brown mooshroom
            variantEntity.setVariant(EntityVariant.Mooshroom.RED);    // Red mooshroom
            
            // PARROT VARIANTS
            variantEntity.setVariant(EntityVariant.Parrot.BLUE);   // Blue parrot
            variantEntity.setVariant(EntityVariant.Parrot.CYAN);   // Yellow-blue parrot
            variantEntity.setVariant(EntityVariant.Parrot.GRAY);   // Gray parrot
            variantEntity.setVariant(EntityVariant.Parrot.GREEN);  // Green parrot
            variantEntity.setVariant(EntityVariant.Parrot.RED);    // Red-blue parrot
            
            // PIG VARIANTS
            variantEntity.setVariant(EntityVariant.Pig.TEMPERATE);  // Temperate pig
            variantEntity.setVariant(EntityVariant.Pig.WARM);       // Warm climate pig
            variantEntity.setVariant(EntityVariant.Pig.COLD);       // Cold climate pig
            
            // RABBIT VARIANTS
            variantEntity.setVariant(EntityVariant.Rabbit.BLACK_AND_WHITE);  // White splotched rabbit
            variantEntity.setVariant(EntityVariant.Rabbit.SALT_AND_PEPPER);  // Salt & pepper rabbit
            variantEntity.setVariant(EntityVariant.Rabbit.ALBINO);           // White albino rabbit
            variantEntity.setVariant(EntityVariant.Rabbit.GOLD);             // Gold rabbit
            variantEntity.setVariant(EntityVariant.Rabbit.BLACK);            // Black rabbit
            variantEntity.setVariant(EntityVariant.Rabbit.BROWN);            // Brown rabbit
            variantEntity.setVariant(EntityVariant.Rabbit.KILLER_BUNNY);     // Evil/killer bunny
            
            // SALMON VARIANTS
            variantEntity.setVariant(EntityVariant.Salmon.SMALL);   // Small salmon
            variantEntity.setVariant(EntityVariant.Salmon.MEDIUM);  // Medium salmon
            variantEntity.setVariant(EntityVariant.Salmon.LARGE);   // Large salmon
            
            // TROPICAL FISH VARIANTS
            variantEntity.setVariant(EntityVariant.TropicalFish.ANEMONE);               // Anemone fish
            variantEntity.setVariant(EntityVariant.TropicalFish.BLACK_TANG);            // Black tang
            variantEntity.setVariant(EntityVariant.TropicalFish.BLUE_TANG);             // Blue tang
            variantEntity.setVariant(EntityVariant.TropicalFish.BLUE_DORY);             // Blue dory
            variantEntity.setVariant(EntityVariant.TropicalFish.BUTTERFLYFISH);         // Butterflyfish
            variantEntity.setVariant(EntityVariant.TropicalFish.CICHLID);               // Cichlid
            variantEntity.setVariant(EntityVariant.TropicalFish.CLOWNFISH);             // Clownfish
            variantEntity.setVariant(EntityVariant.TropicalFish.COTTON_CANDY_BETTA);    // Cotton candy betta
            variantEntity.setVariant(EntityVariant.TropicalFish.DOTTYBACK);             // Dottyback
            variantEntity.setVariant(EntityVariant.TropicalFish.EMPEROR_RED_SNAPPER);   // Emperor red snapper
            variantEntity.setVariant(EntityVariant.TropicalFish.GOATFISH);              // Goatfish
            variantEntity.setVariant(EntityVariant.TropicalFish.MOORISH_IDOL);          // Moorish idol
            variantEntity.setVariant(EntityVariant.TropicalFish.ORNATE_BUTTERFLYFISH);  // Ornate butterflyfish
            variantEntity.setVariant(EntityVariant.TropicalFish.PARROTFISH);            // Parrotfish
            variantEntity.setVariant(EntityVariant.TropicalFish.QUEEN_ANGELFISH);       // Queen angelfish
            variantEntity.setVariant(EntityVariant.TropicalFish.RED_CICHLID);           // Red cichlid
            variantEntity.setVariant(EntityVariant.TropicalFish.RED_LIPPED_BLENNY);     // Red lipped blenny
            variantEntity.setVariant(EntityVariant.TropicalFish.RED_SNAPPER);           // Red snapper
            variantEntity.setVariant(EntityVariant.TropicalFish.THREADFIN);             // Threadfin
            variantEntity.setVariant(EntityVariant.TropicalFish.TOMATO_CLOWNFISH);      // Tomato clownfish
            variantEntity.setVariant(EntityVariant.TropicalFish.TOMATO_CLOWN);          // Tomato clown
            variantEntity.setVariant(EntityVariant.TropicalFish.TRIGGERFISH);           // Triggerfish
            variantEntity.setVariant(EntityVariant.TropicalFish.YELLOWTAIL);            // Yellowtail
            variantEntity.setVariant(EntityVariant.TropicalFish.YELLOW_TANG);           // Yellow tang
            
            // FOX VARIANTS
            variantEntity.setVariant(EntityVariant.Fox.RED);   // Red fox
            variantEntity.setVariant(EntityVariant.Fox.SNOW);  // Snow/arctic fox
            
            // LLAMA VARIANTS
            variantEntity.setVariant(EntityVariant.Llama.BROWN);   // Brown llama
            variantEntity.setVariant(EntityVariant.Llama.CREAMY);  // Creamy llama
            variantEntity.setVariant(EntityVariant.Llama.GRAY);    // Gray llama
            variantEntity.setVariant(EntityVariant.Llama.WHITE);   // White llama
            
            // PANDA VARIANTS
            variantEntity.setVariant(EntityVariant.Panda.AGGRESSIVE);  // Aggressive panda
            variantEntity.setVariant(EntityVariant.Panda.BROWN);       // Brown panda
            variantEntity.setVariant(EntityVariant.Panda.DEFAULT);     // Normal panda
            variantEntity.setVariant(EntityVariant.Panda.LAZY);        // Lazy panda
            variantEntity.setVariant(EntityVariant.Panda.PLAYFUL);     // Playful panda
            variantEntity.setVariant(EntityVariant.Panda.WEAK);        // Weak panda
            variantEntity.setVariant(EntityVariant.Panda.WORRIED);     // Worried panda
            
            // TRADER LLAMA VARIANTS
            variantEntity.setVariant(EntityVariant.TraderLlama.BROWN);   // Brown trader llama
            variantEntity.setVariant(EntityVariant.TraderLlama.CREAMY);  // Creamy trader llama
            variantEntity.setVariant(EntityVariant.TraderLlama.GRAY);    // Gray trader llama
            variantEntity.setVariant(EntityVariant.TraderLlama.WHITE);   // White trader llama
            
            // WOLF VARIANTS
            variantEntity.setVariant(EntityVariant.Wolf.ASHEN);    // Ashen wolf
            variantEntity.setVariant(EntityVariant.Wolf.BLACK);    // Black wolf
            variantEntity.setVariant(EntityVariant.Wolf.CHESTNUT); // Chestnut wolf
            variantEntity.setVariant(EntityVariant.Wolf.PALE);     // Pale wolf
            variantEntity.setVariant(EntityVariant.Wolf.RUSTY);    // Rusty wolf
            variantEntity.setVariant(EntityVariant.Wolf.SNOWY);    // Snowy wolf
            variantEntity.setVariant(EntityVariant.Wolf.SPOTTED);  // Spotted wolf
            variantEntity.setVariant(EntityVariant.Wolf.STRIPED);  // Striped wolf
            variantEntity.setVariant(EntityVariant.Wolf.WOODS);    // Woods wolf
        }
        
        // ===== COMPLETE EXAMPLE: NPC QUEST GIVER (WITH ASYNC SCHEDULER) =====
        public void createQuestGiver(Location location, Player player) {
            Bukkit.getScheduler().runTaskAsynchronously(plugin, () -> {
                // Create the NPC entity
                EdEntity npc = edLibAPI.createEntity(EntityType.VILLAGER, location);
                npc.setDisplayName("§6Quest Master");
                
                npc.setGlowing(EdColor.GOLD);
                
                // Add patrol behavior
                npc.addGoal(new EdGoalMove(location.clone().add(5, 0, 0).toVector(), 0.1));
                npc.addGoal(new EdGoalDelay(40));
                npc.addGoal(new EdGoalMove(location.clone().add(-5, 0, 0).toVector(), 0.1));
                npc.addGoal(new EdGoalDelay(40));
                
                // Make visible and spawn
                npc.addWatcher(player);
                npc.spawn();
                
                // Equipment setup
                npc.setEquipment(EntityEquipmentSlot.MAIN_HAND, new ItemStack(Material.BOOK));
                
                // Create interaction zone
                EdEntity interaction = edLibAPI.createInteractionEntity(location, 3.0f, 3.0f);
                interaction.addWatcher(player);
                interaction.spawn();
                
                // Set up click handling (in your click event listener)
                // if (clickedEntityId == interaction.getId()) {
                //     Bukkit.getScheduler().runTask(plugin, () -> {
                //         guisAPI.openGui(player, "quest_menu");
                //     });
                // }
            });
        }
        
        // ===== ASYNC EXAMPLES FOR DIFFERENT OPERATIONS =====
        
        // Currency operations (async recommended)
        Bukkit.getScheduler().runTaskAsynchronously(plugin, () -> {
            BigDecimal balance = currencyAPI.getCurrency(playerUUID, "money");
            currencyAPI.addCurrency(playerUUID, "money", new BigDecimal("500"));
            
            player.sendMessage("§a+500 money! Balance: " + balance);
        });
        
        // Zone operations (async for data, sync for world changes)
        Bukkit.getScheduler().runTaskAsynchronously(plugin, () -> {
            String currentZone = zonesAPI.getPlayerZoneId(player);
            Set<Integer> mobs = zonesAPI.getPlayerMobsInZone(player);
        
            zonesAPI.joinSession(player, "new-zone");
            player.sendMessage("§aJoined new zone! Mobs available: " + mobs.size());
        });
        
        // Enchantment operations (async recommended)
        Bukkit.getScheduler().runTaskAsynchronously(plugin, () -> {
            double currentLevel = enchantAPI.getEnchantLevel(playerUUID, "fire_sword");
            enchantAPI.addEnchantLevel(playerUUID, "fire_sword", 1.0);
            double newLevel = enchantAPI.getEnchantLevel(playerUUID, "fire_sword");
            
            player.sendMessage("§6Fire Sword: " + currentLevel + " → " + newLevel);
        });
        
        // Entity creation and management (can be async)
        Bukkit.getScheduler().runTaskAsynchronously(plugin, () -> {
            EdEntity guard = edLibAPI.createEntity(EntityType.IRON_GOLEM, location);
            guard.setDisplayName("§7Guardian");
            guard.setGlowing(EdColor.BLUE);
            
            guard.addWatcher(player);
            guard.spawn();
            
            guard.setEquipment(EntityEquipmentSlot.MAIN_HAND, new ItemStack(Material.IRON_SWORD));
            
            // Add movement goals
            guard.addGoal(new EdGoalOrbit(location.toVector(), 5.0, 0.03, true, 0));
        });
        
        // Booster management (async recommended)
        Bukkit.getScheduler().runTaskAsynchronously(plugin, () -> {
            double moneyBoost = boostersAPI.getBoosterValueByEconomy(playerUUID, "money");
            List<String> activeBoosters = boostersAPI.getActiveBoosters(playerUUID);
            
            if (moneyBoost > 1.0) {
                player.sendMessage("§6Money boost active: " + (moneyBoost * 100) + "%");
                player.sendMessage("§eActive boosters: " + activeBoosters.size());
            }
        });
        
        // GUI operations (sync required for player interactions)
        Bukkit.getScheduler().runTask(plugin, () -> {
            Map<String, String> placeholders = new HashMap<>();
            placeholders.put("player_name", player.getName());
            
            // Get data async first, then open GUI sync
            Bukkit.getScheduler().runTaskAsynchronously(plugin, () -> {
                BigDecimal balance = currencyAPI.getCurrency(player.getUniqueId(), "money");
                
                Bukkit.getScheduler().runTask(plugin, () -> {
                    placeholders.put("balance", balance.toString());
                    guisAPI.openGui(player, "player_menu", placeholders);
                });
            });
        });
        
        // ===== PERFORMANCE CONSIDERATIONS =====
        // CRITICAL: Use Bukkit async scheduler for all API operations to prevent main thread blocking
        
        // ASYNC RECOMMENDED:
        // - Currency operations (balance checks, transactions)
        // - Enchantment level queries and modifications  
        // - Booster value calculations and management
        // - Zone data queries and session management
        // - Entity creation and property setting
        // - Leveling system operations
        // - Model loading and configuration
        
        // SYNC REQUIRED:
        // - GUI opening and closing (player interactions)
        // - Bukkit world modifications (block changes, teleportation)
        // - Bukkit inventory modifications
        // - Player message sending
        // - Bukkit entity spawning/despawning
        
        // BEST PRACTICES:
        // - Use entity watchers to control visibility per player
        // - Clean up entities when players leave or switch zones  
        // - Use short teleports for frequent position updates
        // - Batch operations when possible with async processing
        // - Remove unused boss bars and GUI sessions
        // - Clear goal queues when entities are removed
        // - Always wrap API calls in async scheduler unless sync is required
        // - Use sync callbacks for UI updates after async data operations
        
        // EXAMPLE ASYNC PATTERN:
        Bukkit.getScheduler().runTaskAsynchronously(plugin, () -> {
            // Heavy API operations here
            BigDecimal balance = currencyAPI.getCurrency(uuid, "money");
            double enchantLevel = enchantAPI.getEnchantLevel(uuid, "sword");
            
            player.sendMessage("Balance: " + balance + ", Enchant: " + enchantLevel);
        });
        
        // ===== COMPATIBILITY NOTES =====
        // - EdLib handles NMS abstraction across versions
        // - All operations are client-side for fake entities
        // - Currency operations use BigDecimal for precision
        // - Enchantment chances are 0.0 to 1.0 decimal values
        // - Zone sessions are per-player instances
        // - Booster times are in milliseconds
        // - Model animations require BDEngine integration
    `
};

