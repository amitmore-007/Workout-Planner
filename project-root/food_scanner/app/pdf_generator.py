from fpdf import FPDF
from datetime import datetime
import re
import textwrap
import unicodedata

class BeautifulRecipePDF(FPDF):
    def __init__(self, language='en'):
        super().__init__()
        self.language = language
        self.set_auto_page_break(auto=True, margin=15)
        
    def safe_text(self, text):
        """Convert text to latin-1 safe format"""
        if not text:
            return ""
        
        # Replace common Unicode characters with ASCII equivalents
        replacements = {
            '•': '* ',
            '–': '-',
            '—': '-',
            '"': '"',
            '"': '"',
            ''': "'",
            ''': "'",
            '…': '...',
            '°': ' degrees',
            '½': '1/2',
            '¼': '1/4',
            '¾': '3/4',
            '™': '(TM)',
            '®': '(R)',
            '©': '(C)',
            # Remove emojis and replace with text
            '🍳': '[COOKING] ',
            '📝': '[NOTE] ',
            '🛒': '[SHOPPING] ',
            '👨‍🍳': '[CHEF] ',
            '⏰': '[TIME] ',
            '🥗': '[NUTRITION] ',
            '✨': '',
            '🥘': '[INGREDIENTS] ',
        }
        
        for unicode_char, replacement in replacements.items():
            text = text.replace(unicode_char, replacement)
        
        # Remove any remaining emojis and special Unicode characters
        text = re.sub(r'[^\x00-\x7F]+', '', text)
        
        # Clean up extra spaces
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Ensure text can be encoded as latin-1
        try:
            text.encode('latin-1')
            return text
        except UnicodeEncodeError:
            # If still problematic, remove non-latin-1 characters
            return ''.join(char for char in text if ord(char) < 256)
        
    def header(self):
        # Add a beautiful header with gradient-like effect
        self.set_fill_color(120, 40, 200)  # Purple color
        self.rect(0, 0, 210, 30, 'F')
        
        # Title
        self.set_font('Arial', 'B', 20)
        self.set_text_color(255, 255, 255)  # White text
        self.set_y(8)
        self.cell(0, 10, self.safe_text('AI Generated Recipe'), 0, 1, 'C')
        
        # Subtitle
        self.set_font('Arial', 'I', 10)
        self.cell(0, 5, self.safe_text('Crafted with Artificial Intelligence'), 0, 1, 'C')
        self.ln(10)
        
    def footer(self):
        # Beautiful footer
        self.set_y(-15)
        self.set_fill_color(240, 240, 240)
        self.rect(0, self.get_y(), 210, 15, 'F')
        
        self.set_font('Arial', 'I', 8)
        self.set_text_color(100, 100, 100)
        footer_text = f'Generated on {datetime.now().strftime("%B %d, %Y at %I:%M %p")} | Page {self.page_no()}'
        self.cell(0, 10, self.safe_text(footer_text), 0, 0, 'C')
        
    def add_section_header(self, title, icon_text=''):
        # Add some space
        self.ln(5)
        
        # Section header with background
        self.set_fill_color(250, 250, 250)
        self.rect(self.get_x(), self.get_y(), 190, 8, 'F')
        
        self.set_font('Arial', 'B', 14)
        self.set_text_color(80, 40, 160)  # Purple text
        header_text = f'{icon_text} {title}' if icon_text else title
        self.cell(0, 8, self.safe_text(header_text), 0, 1, 'L', True)
        self.ln(3)
        
    def add_text_content(self, text, is_list=False):
        self.set_font('Arial', '', 11)
        self.set_text_color(60, 60, 60)  # Dark gray
        
        safe_content = self.safe_text(text)
        
        if is_list:
            # Handle list items
            lines = safe_content.split('\n')
            for line in lines:
                line = line.strip()
                if line:
                    if not line.startswith('* '):
                        line = f'* {line}'
                    self.cell(0, 6, line, 0, 1, 'L')
        else:
            # Handle regular paragraphs
            words = safe_content.split()
            lines = textwrap.wrap(' '.join(words), width=80)
            for line in lines:
                self.cell(0, 6, line, 0, 1, 'L')
        self.ln(2)
        
    def add_highlight_box(self, title, content, color=(255, 248, 220)):
        safe_title = self.safe_text(title)
        safe_content = self.safe_text(content)
        
        # Calculate box height
        content_lines = safe_content.split('\n')
        box_height = len(content_lines) * 6 + 15
        
        # Add a highlighted box for important info
        self.set_fill_color(*color)
        self.rect(self.get_x(), self.get_y(), 190, box_height, 'F')
        
        self.set_font('Arial', 'B', 12)
        self.set_text_color(200, 100, 0)  # Orange text
        self.cell(0, 8, safe_title, 0, 1, 'L')
        
        self.set_font('Arial', '', 10)
        self.set_text_color(80, 80, 80)
        for line in content_lines:
            if line.strip():
                self.cell(0, 6, line.strip(), 0, 1, 'L')
        self.ln(5)

def clean_markdown(text):
    """Remove markdown formatting while preserving structure"""
    if not text:
        return ""
    
    # Remove code blocks
    text = re.sub(r'```[^`]*```', '', text, flags=re.DOTALL)
    
    # Remove headers but keep the text
    text = re.sub(r'^#+\s*', '', text, flags=re.MULTILINE)
    
    # Remove bold/italic markers
    text = text.replace('**', '').replace('__', '').replace('*', '').replace('_', '')
    
    # Convert list markers to simple bullets
    text = re.sub(r'^\s*[\*\-\+]\s*', '* ', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*\d+\.\s*', '* ', text, flags=re.MULTILINE)
    
    return text.strip()

def extract_sections(recipe_text):
    """Extract different sections from the recipe with better parsing"""
    sections = {
        'title': '',
        'description': '',
        'ingredients': '',
        'instructions': '',
        'nutrition': '',
        'cooking_time': '',
        'other_content': ''  # For any content that doesn't fit other categories
    }
    
    if not recipe_text:
        return sections
    
    # Clean the text but preserve structure
    cleaned_text = clean_markdown(recipe_text)
    
    # Split into paragraphs
    paragraphs = re.split(r'\n\s*\n', cleaned_text)
    current_section = 'description'
    
    for paragraph in paragraphs:
        if not paragraph.strip():
            continue
            
        lines = paragraph.strip().split('\n')
        first_line = lines[0].lower().strip()
        
        # More comprehensive section detection
        if any(keyword in first_line for keyword in [
            'recipe name', 'title', 'dish name', 'recipe title'
        ]):
            current_section = 'title'
            # Extract title from the paragraph
            title_content = '\n'.join(lines[1:]) if len(lines) > 1 else paragraph
            if title_content.strip():
                sections['title'] = title_content.strip()
            continue
            
        elif any(keyword in first_line for keyword in [
            'ingredient', 'what you need', 'materials', 'you will need', 'shopping list'
        ]):
            current_section = 'ingredients'
            content = '\n'.join(lines[1:]) if len(lines) > 1 else ''
            
        elif any(keyword in first_line for keyword in [
            'instruction', 'method', 'preparation', 'steps', 'how to', 'directions', 
            'cooking method', 'procedure', 'recipe steps'
        ]):
            current_section = 'instructions'
            content = '\n'.join(lines[1:]) if len(lines) > 1 else ''
            
        elif any(keyword in first_line for keyword in [
            'nutrition', 'calories', 'nutritional', 'health info', 'dietary'
        ]):
            current_section = 'nutrition'
            content = '\n'.join(lines[1:]) if len(lines) > 1 else ''
            
        elif any(keyword in first_line for keyword in [
            'time', 'duration', 'prep time', 'cook time', 'cooking time', 
            'preparation time', 'total time'
        ]):
            current_section = 'cooking_time'
            content = '\n'.join(lines[1:]) if len(lines) > 1 else ''
            
        elif any(keyword in first_line for keyword in [
            'description', 'about', 'overview', 'summary'
        ]):
            current_section = 'description'
            content = '\n'.join(lines[1:]) if len(lines) > 1 else ''
            
        else:
            # Regular content - add to current section
            content = paragraph
        
        # Add content to the appropriate section
        if content.strip():
            if sections[current_section]:
                sections[current_section] += '\n\n' + content.strip()
            else:
                sections[current_section] = content.strip()
    
    # If no explicit title found, extract from description or use a generic one
    if not sections['title']:
        if sections['description']:
            first_line = sections['description'].split('\n')[0]
            if len(first_line) < 150:  # Likely a title
                sections['title'] = first_line
                # Remove title from description
                remaining_lines = sections['description'].split('\n')[1:]
                sections['description'] = '\n'.join(remaining_lines).strip()
        
        # If still no title, create one
        if not sections['title']:
            sections['title'] = "Delicious AI Generated Recipe"
    
    # Combine any remaining content that wasn't categorized
    all_content = cleaned_text
    used_content = '\n'.join([v for v in sections.values() if v])
    
    # If there's significant content not captured, add it to other_content
    if len(all_content) > len(used_content) * 1.2:  # 20% more content exists
        sections['other_content'] = all_content
    
    return sections

def generate_recipe_pdf(recipe_data, output_path):
    try:
        language = recipe_data.get("language", "en")
        recipe_text = recipe_data.get("recipe", "")
        ingredients_input = recipe_data.get("ingredients", "")
        
        if not recipe_text:
            print("Error: No recipe text provided")
            return False
        
        # Create PDF instance
        pdf = BeautifulRecipePDF(language)
        pdf.add_page()
        
        # Always use the full content approach to ensure nothing is missed
        pdf.set_font('Arial', 'B', 18)
        pdf.set_text_color(80, 40, 160)
        
        # Try to extract title from the first meaningful line
        cleaned_content = clean_markdown(recipe_text)
        first_lines = cleaned_content.split('\n')[:3]  # Check first 3 lines for title
        title = "AI Generated Recipe"
        
        for line in first_lines:
            line = line.strip()
            if line and len(line) < 100 and not line.startswith(('*', '-', '•')):
                # Check if it looks like a title (not too long, no list markers)
                if not any(word in line.lower() for word in ['ingredient', 'instruction', 'step', 'minute', 'hour']):
                    title = line
                    break
        
        pdf.cell(0, 12, pdf.safe_text(title), 0, 1, 'C')
        pdf.ln(5)
        
        # Original Ingredients Input (if available)
        if ingredients_input and ingredients_input.strip():
            pdf.add_highlight_box('[INGREDIENTS] Original Ingredients', ingredients_input, (230, 250, 230))
        
        # Process the entire recipe content systematically
        pdf.add_section_header('Complete Recipe', '[CHEF]')
        
        # Split content into paragraphs and process each one
        paragraphs = re.split(r'\n\s*\n', cleaned_content)
        
        current_section = None
        
        for paragraph in paragraphs:
            if not paragraph.strip():
                continue
            
            lines = paragraph.strip().split('\n')
            first_line = lines[0].strip().lower()
            
            # Detect if this is a section header
            section_detected = False
            
            if any(keyword in first_line for keyword in [
                'ingredient', 'what you need', 'materials', 'shopping list'
            ]):
                if current_section != 'ingredients':
                    pdf.add_section_header('Ingredients', '[SHOPPING]')
                    current_section = 'ingredients'
                section_detected = True
                content_lines = lines[1:] if len(lines) > 1 else []
                
            elif any(keyword in first_line for keyword in [
                'instruction', 'method', 'preparation', 'steps', 'directions', 'how to'
            ]):
                if current_section != 'instructions':
                    pdf.add_section_header('Instructions', '[CHEF]')
                    current_section = 'instructions'
                section_detected = True
                content_lines = lines[1:] if len(lines) > 1 else []
                
            elif any(keyword in first_line for keyword in [
                'nutrition', 'calories', 'nutritional', 'health'
            ]):
                if current_section != 'nutrition':
                    pdf.add_section_header('Nutrition Information', '[NUTRITION]')
                    current_section = 'nutrition'
                section_detected = True
                content_lines = lines[1:] if len(lines) > 1 else []
                
            elif any(keyword in first_line for keyword in [
                'time', 'duration', 'prep', 'cook'
            ]):
                if current_section != 'time':
                    pdf.add_highlight_box('[TIME] Cooking Information', paragraph, (255, 248, 220))
                    current_section = 'time'
                continue
                
            else:
                # Regular content
                content_lines = lines
            
            # Process the content
            if content_lines or not section_detected:
                content_to_process = '\n'.join(content_lines) if section_detected else paragraph
                
                if content_to_process.strip():
                    # Determine if it should be formatted as a list
                    is_list = False
                    if current_section in ['ingredients', 'instructions']:
                        # Check if multiple lines start with list indicators
                        list_indicators = sum(1 for line in content_to_process.split('\n') 
                                            if line.strip().startswith(('*', '-', '•', '1.', '2.', '3.')))
                        is_list = list_indicators >= 2 or current_section == 'ingredients'
                    
                    pdf.add_text_content(content_to_process, is_list=is_list)
        
        # If no sections were detected, add the entire content as one block
        if current_section is None:
            pdf.add_text_content(cleaned_content)
        
        # Add a decorative end
        pdf.ln(10)
        pdf.set_font('Arial', 'B', 14)
        pdf.set_text_color(80, 40, 160)
        pdf.cell(0, 10, pdf.safe_text('Bon Appetit! Enjoy your delicious meal!'), 0, 1, 'C')
        
        # Save the PDF
        pdf.output(output_path)
        print(f"PDF successfully generated: {output_path}")
        return True
        
    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        import traceback
        traceback.print_exc()
        return False