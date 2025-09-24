# Design for mobile and desktop

## Context and problem statement

Many users prefer to access the website using their phones, which are always
available and convenient. However, some users will use desktop computers for a
larger screen and easier visibility. The site must provide a good user
experience on both mobile and desktop environments, ensuring usability and
accessibility regardless of device.

## Decision and justification

The decision is to design the website to work well on both mobile and desktop
devices.

TailwindCSS selectors will be used to create responsive layouts that adapt to
different screen sizes. During feature and interface design, special attention
will be paid to the needs of mobile users, ensuring that all elements remain
visible and usable on small screens. This approach will provide a consistent
and high-quality experience for all users, regardless of their device.

## Other options considered

- Fixed desktop-only layout: Would provide a good experience for desktop users
  but make the site difficult or unusable on mobile devices.
- Separate mobile and desktop sites: Increases development and maintenance
  effort, and can lead to inconsistent user experiences.

## Additional information

Related decisions:

- [Styling via TailwindCSS](0009-madr-styling-via-tailwindcss.md)
- [HeroUI for UI components](0010-madr-heroui-for-ui-components.md)
