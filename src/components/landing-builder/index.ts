/**
 * ============================================================================
 * FILE: src/components/landing-builder/index.ts
 * PURPOSE: Dashboard builder components - EDIT landing config JSON
 * 🚀 AUTO-DISCOVERY SYSTEM ENABLED!
 * ============================================================================
 */

export { LandingBuilder } from './landing-builder';
export { LandingBuilderSimplified } from './landing-builder-simplified';
export { TestimonialEditor } from './testimonial-editor';
export { LandingErrorBoundary } from './landing-error-boundary';
export { TemplateSelector } from './template-selector';
export { LivePreview } from './live-preview';

// New builder UI components (with auto-discovery)
export { DeviceFrame } from './device-frame';
export { PreviewModeToggle } from './preview-mode-toggle';
export { BuilderSidebar } from './builder-sidebar';
export { SectionSheet } from './section-sheet';
export { BlockDrawer } from './block-drawer'; // 🚀 Auto-discovers blocks from filesystem!
export { BLOCK_OPTIONS_MAP } from './block-options'; // 🚀 Auto-generated block metadata
export { BuilderLoadingSteps } from './builder-loading-steps'; // 🚀 Real loading screen

export type { DeviceMode } from './device-frame';
export type { LoadingStates } from './builder-loading-steps';
export type { SectionType } from './builder-sidebar';
export type { DrawerState } from './block-drawer';
export type { BlockOption } from './block-options';
