import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IconControl } from './IconControl';
import { ComponentNode } from '@/types/component-nodes';

// Mock the updateProps function
const mockUpdateProps = jest.fn();

describe('IconControl', () => {
  beforeEach(() => {
    // Clear mock history before each test
    mockUpdateProps.mockClear();
  });

  const createMockComponent = (props: Record<string, any>): ComponentNode => ({
    id: 'button-1',
    type: 'Button',
    props,
    children: [],
    x: 0,
    y: 0,
  });

  test('renders correctly with no icon selected', () => {
    const component = createMockComponent({});
    render(<IconControl selectedComponent={component} updateProps={mockUpdateProps} />);

    // "none" should be selected in both the dropdown and the radio group
    expect(screen.getByText('none')).toBeInTheDocument(); // For Select value
    expect(screen.getByLabelText('None')).toBeChecked();
  });

  test('renders correctly when an icon is on the left', () => {
    const component = createMockComponent({ iconLeft: 'Check' });
    render(<IconControl selectedComponent={component} updateProps={mockUpdateProps} />);

    // The icon name and position should be reflected
    expect(screen.getByText('Check')).toBeInTheDocument();
    expect(screen.getByLabelText('Left')).toBeChecked();
  });

  test('calls updateProps correctly when changing icon position to right', () => {
    const component = createMockComponent({ iconLeft: 'Check' });
    render(<IconControl selectedComponent={component} updateProps={mockUpdateProps} />);

    // Click the "Right" radio button
    fireEvent.click(screen.getByLabelText('Right'));

    // Expect updateProps to be called with the icon moved to the right prop
    expect(mockUpdateProps).toHaveBeenCalledWith('button-1', {
      iconLeft: undefined,
      iconRight: 'Check',
    });
  });

  test('calls updateProps correctly when changing icon name', () => {
    const component = createMockComponent({ iconLeft: 'Check' });
    render(<IconControl selectedComponent={component} updateProps={mockUpdateProps} />);

    // Open the select dropdown
    fireEvent.mouseDown(screen.getByRole('combobox'));

    // Click the "Upload" option
    fireEvent.click(screen.getByText('Upload'));

    // Expect updateProps to be called with the new icon name on the left
    expect(mockUpdateProps).toHaveBeenCalledWith('button-1', {
      iconLeft: 'Upload',
      iconRight: undefined,
    });
  });

  test('calls updateProps correctly when changing position to none', () => {
    const component = createMockComponent({ iconRight: 'User' });
    render(<IconControl selectedComponent={component} updateProps={mockUpdateProps} />);

    // Click the "None" radio button
    fireEvent.click(screen.getByLabelText('None'));

    // Expect updateProps to be called with both icon props as undefined
    expect(mockUpdateProps).toHaveBeenCalledWith('button-1', {
      iconLeft: undefined,
      iconRight: undefined,
    });
  });

  test('calls updateProps correctly when selecting an icon when position is none', () => {
    const component = createMockComponent({});
    render(<IconControl selectedComponent={component} updateProps={mockUpdateProps} />);

    // Open the select dropdown
    fireEvent.mouseDown(screen.getByRole('combobox'));

    // Click the "Settings" option
    fireEvent.click(screen.getByText('Settings'));

    // When no position is set, it should not set any prop
    expect(mockUpdateProps).toHaveBeenCalledWith('button-1', {
      iconLeft: undefined,
      iconRight: undefined,
    });
  });
});
