module.exports = {
    name: 'NextGens',
    description: 'NextGens is a tycoon-style generator plugin. It exposes APIs to manage generators, economy, events, autoselling, and utilities for survival/prison servers.',
    pluginId: 'NextGens',
    systemDownloadURL: `
        https://github.com/mdaffa48/NextGens/releases/latest
        https://www.spigotmc.org/resources/nextgens-minecraft-gens-tycoon-plugin.111857/
    `,
    dependencies: `
        Java 21
    `,
    mavenIntegration: `
        <repositories>
            <!-- The plugin does not publish artifacts to public Maven repositories. Install it locally or host it in your private repository. -->
        </repositories>
        <dependencies>
            <dependency>
                <groupId>com.muhammaddaffa</groupId>
                <artifactId>NextGens</artifactId>
                <version>1.3.0</version>
                <scope>system</scope>
                <systemPath>${project.basedir}/lib/NextGens.jar</systemPath>
            </dependency>

            <!-- Optional dependencies exposed via the API -->
            <dependency>
                <groupId>org.spigotmc</groupId>
                <artifactId>spigot-api</artifactId>
                <version>1.21.5-R0.1-SNAPSHOT</version>
                <scope>provided</scope>
            </dependency>
            <dependency>
                <groupId>com.github.MilkBowl</groupId>
                <artifactId>VaultAPI</artifactId>
                <version>1.7.1</version>
                <scope>provided</scope>
            </dependency>
            <dependency>
                <groupId>me.clip</groupId>
                <artifactId>placeholderapi</artifactId>
                <version>2.11.6</version>
                <scope>provided</scope>
            </dependency>
            <dependency>
                <groupId>com.github.brcdev-minecraft</groupId>
                <artifactId>shopgui-api</artifactId>
                <version>3.0.0</version>
                <scope>provided</scope>
            </dependency>
        </dependencies>
    `,
    usage: `
    === INITIALISATION ===
    - Add NextGens as a dependency (depend or softdepend) in your addon's plugin.yml.
    - Access the API lazily via com.muhammaddaffa.nextgens.NextGens#getApi().

    NextGens main class: com.muhammaddaffa.nextgens.NextGens
    Static methods
    - static NextGens getInstance()
    - static GeneratorAPI getApi()

    Relevant instance methods
    - GeneratorManager getGeneratorManager()
    - RefundManager getRefundManager()
    - UserManager getUserManager()
    - WorthManager getWorthManager()
    - SellManager getSellManager()
    - SellwandManager getSellwandManager()
    - EventManager getEventManager()
    - SellMultiplierRegistry getMultiplierRegistry()

    === GENERATOR API ===
    GeneratorAPI class: com.muhammaddaffa.nextgens.api
    Instantiation
    GeneratorAPI api = NextGens.getApi();

    Key methods
    - @Nullable Generator getGenerator(String id)
    - @Nullable Generator getGenerator(ItemStack stack)
    - Collection<ActiveGenerator> getActiveGenerator()
    - List<ActiveGenerator> getActiveGenerator(UUID owner)
    - @Nullable ActiveGenerator getActiveGenerator(Location location)
    - void unregisterGenerator(Location location)
    - void giveGenerator(UUID target, String generatorId)
    - User getUser(UUID uuid)
    - int getGeneratorLimit(Player player)
    - Double getWorth(ItemStack stack) // honours ShopGUI+, item metadata, and configuration values
    - ItemStack createSellwand(double multiplier, int uses)
    - void updateSellwand(ItemStack stack)
    - @Nullable Event getActiveEvent()
    - List<Event> getEvents()

    Registered NamespacedKeys (PersistentDataContainer):
    - NextGens.generator_id
    - NextGens.drop_value
    - NextGens.sellwand_multiplier / sellwand_uses / sellwand_total_sold / sellwand_total_items

    === CUSTOM EVENTS ===
    Generators (com.muhammaddaffa.nextgens.api.events.generators)
    - GeneratorEvent (abstract base)
    - GeneratorPlaceEvent
    - GeneratorLoadEvent
    - GeneratorBreakEvent
    - GeneratorUpgradeEvent
    - GeneratorCorruptedEvent
    - GeneratorGenerateItemEvent

    Economy & selling (com.muhammaddaffa.nextgens.api.events.sell)
    - SellEvent (primary selling callback)
    - SellCommandUseEvent
    - SellwandUseEvent

    Cashback (com.muhammaddaffa.nextgens.api.events)
    - PlayerCashbackEvent

    Register your listeners with Bukkit just like any other Bukkit event.

    === MULTIPLIERS & SELLING ===
    SellMultiplierRegistry class: com.muhammaddaffa.nextgens.sell.multipliers
    - void register(String key, SellMultiplierProvider provider)
    - SellMultiplierProvider interface supplies double getMultiplier(Player player, ActiveGenerator generator)

    WorthManager class: com.muhammaddaffa.nextgens.worth
    - void load() // reloads worth.yml
    - Double getMaterialWorth(ItemStack stack)
    - Double getItemWorth(ItemStack stack)

    === AUTOSAVE & TASKS ===
    GeneratorTask.start(GeneratorManager, EventManager, UserManager)
    CorruptionTask.start(GeneratorManager)
    NotifyTask.start(GeneratorManager)
    AutosellManager.startTask()
    // All tasks are scheduled automatically when the plugin enables. Override or cancel them from your addon if required.

    === DATABASE & REPOSITORIES ===
    DatabaseManager (MySQL/HikariCP) exposes:
    - void connect()
    - void close()
    - void createGeneratorTable()
    - void createUserTable()

    UserRepository class: com.muhammaddaffa.nextgens.users
    - void loadUsers()
    - void save(User user)

    === TIPS ===
    - Initialize the API during your addon's onEnable after confirming NextGens is active.
    - Use Executor (com.muhammaddaffa.mdlib.utils.Executor) to run async/sync tasks just like the main plugin does.
    - Honour NextGens.STOPPING to avoid heavy operations during shutdown.
    `
};
